import express, { Router } from 'express';
import { UsersSchema } from '../db'
import jwt from 'jsonwebtoken'
import "dotenv/config"
import bcrypt from 'bcrypt'
import { userMiddleWare } from '../Middlewares/user';
import { inputValidation } from '../Middlewares/validation';

export const userRouter: Router = express();

//@ts-ignore
userRouter.post('/signup', inputValidation, async (req, res) => {

    const parseData = inputValidation.safeParse(req.body);

    if (!parseData.success) {
        res.json({
            message: "incorrect format",
            //@ts-ignore
            error: parseData.error
        })
        return;
    }

    try {

        const { userName, firstName, lastName, email, password, bankName } = req.body;

        const hashedPassword = await bcrypt.hash(password, 6);

        const randomBalance = Math.floor(Math.random() * 10000) + 1;

        const newUser = await UsersSchema.create({
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            bankName: bankName,
            balance: randomBalance
        })
        const token = jwt.sign({
            id: newUser._id
            //@ts-ignore
        }, process.env.JWT_USERS_PASSWORD)
        res.status(200).json({
            message: "You'r account is created",
            token
        });

    } catch (error) {
        console.log(error)
    }
})

userRouter.post('/signin', async (req, res) => {

    try {

        const { userName, email, password } = req.body;

        const foundUser = await UsersSchema.findOne({
            userName: userName,
            email: email,
        })

        if (foundUser && await bcrypt.compare(password, foundUser.password as string)) {
            const token = jwt.sign({
                id: foundUser._id,
                //@ts-ignore
            }, process.env.JWT_USERS_PASSWORD);

            res.status(200).json({
                message: "You're login",
                token,
                balance: foundUser.balance
            })
        } else {
            res.status(400).json({
                message: "Incorrect credentials",
            });
        }
    } catch (error) {
        console.log(error);
    }

})


//@ts-ignore
userRouter.put('/update-profile', userMiddleWare, inputValidation, async (req, res) => {

    //@ts-ignore
    const userId = req.userId;

    try {

        const parseData = inputValidation.safeParse(req.body);

        if (!parseData.success) {
            res.json({
                message: "incorrect format",
                //@ts-ignore
                error: parseData.error
            })
            return;
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 6)
        }

        const updatedUser = await UsersSchema.findByIdAndUpdate(userId, req.body, {
            new: true
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//@ts-ignore
userRouter.delete('/profile', userMiddleWare, async (req, res) => {

    try {
        //@ts-ignore
        const userId = req.userId

        const deleteUser = await UsersSchema.findByIdAndDelete(userId, req.body)

        res.json({
            message: "User deleted",
            deleteUser
        })
    } catch (e) {
        console.log(e)
    }
})