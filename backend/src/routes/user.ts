import express, { Router } from 'express';
import { UsersSchema } from '../db'
import jwt from 'jsonwebtoken'
import "dotenv/config"
import bcrypt from 'bcrypt'
import { userMiddleWare } from '../Middlewares/user';
import { userInputSchema } from '../Middlewares/validation';
import z from 'zod'

export const userRouter = express.Router();

//@ts-ignore
userRouter.post('/signup', async (req, res) => {

    try {

        const userInputSchema = z.object({
            userName: z.string().min(3, "Username should be at least 3 characters long"),
            email: z.string().email("Invalid email"),
            password: z
                .string()
                .min(8, "Password must be at least 8 characters long")
                .max(30, "Password too long")
                .regex(/[A-Z]/, "Must include at least one uppercase letter")
                .regex(/[a-z]/, "Must include at least one lowercase letter")
                .regex(/[0-9]/, "Must include at least one number")
                .regex(/[@$!%*?&]/, "Must include at least one special character"),
            firstName: z.string().min(1),
            lastName: z.string().min(1),
            bankName: z.string().min(1),
        })


        const parsed = userInputSchema.safeParse(req.body);
        if (!parsed.success) {
            //@ts-ignore
            return res.status(400).json({
                message: "Invalid input format",
                errors: parsed.error.issues
            });
        }

        const { userName, firstName, lastName, email, password, bankName } = req.body;

        const randomBalance = Math.floor(Math.random() * 10000) + 1;

        const newUser = await UsersSchema.create({
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
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
            password: password
        })

        if (foundUser) {
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
userRouter.put('/update-profile', userMiddleWare, async (req, res) => {

    //@ts-ignore
    const userId = req.userId;

    try {


        const parsed = userInputSchema.safeParse(req.body);
        if (!parsed.success) {
            //@ts-ignore
            return res.status(400).json({
                message: "Invalid input format",
                errors: parsed.error.issues
            });
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