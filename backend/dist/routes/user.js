"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../Middlewares/user");
exports.userRouter = (0, express_1.default)();
exports.userRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inputValidation = zod_1.default.object({
            userName: zod_1.default.string().min(3, "Username should be at least 3 characters long"),
            email: zod_1.default.string().email("Invalid email"),
            password: zod_1.default
                .string()
                .min(8, "Password must be at least 8 characters long")
                .max(30, "Password too long")
                .regex(/[A-Z]/, "Must include at least one uppercase letter")
                .regex(/[a-z]/, "Must include at least one lowercase letter")
                .regex(/[0-9]/, "Must include at least one number")
                .regex(/[@$!%*?&]/, "Must include at least one special character"),
            firstName: zod_1.default.string().min(1),
            lastName: zod_1.default.string().min(1),
            bankName: zod_1.default.string().min(1),
        });
        const parseData = inputValidation.safeParse(req.body);
        if (!parseData.success) {
            res.json({
                message: "incorrect format",
                //@ts-ignore
                error: parseData.error
            });
            return;
        }
        const { userName, firstName, lastName, email, password, bankName } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 6);
        const randomBalance = Math.floor(Math.random() * 10000) + 1;
        const newUser = yield db_1.UsersSchema.create({
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            bankName: bankName,
            balance: randomBalance
        });
        const token = jsonwebtoken_1.default.sign({
            id: newUser._id
            //@ts-ignore
        }, process.env.JWT_USERS_PASSWORD);
        res.status(200).json({
            message: "You'r account is created",
            token
        });
    }
    catch (error) {
        console.log(error);
    }
}));
exports.userRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const foundUser = yield db_1.UsersSchema.findOne({
            userName: userName,
            email: email,
        });
        if (foundUser && (yield bcrypt_1.default.compare(password, foundUser.password))) {
            const token = jsonwebtoken_1.default.sign({
                id: foundUser._id,
                //@ts-ignore
            }, process.env.JWT_USERS_PASSWORD);
            res.status(200).json({
                message: "You're login",
                token,
                balance: foundUser.balance
            });
        }
        else {
            res.status(400).json({
                message: "Incorrect credentials",
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}));
//@ts-ignore
exports.userRouter.put('/update-profile', user_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.userId;
    try {
        const updatedUser = yield db_1.UsersSchema.findByIdAndUpdate(userId, req.body, {
            new: true
        });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Profile updated successfully", updatedUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.userRouter.delete('/profile', (req, res) => {
    res.json('working');
});
