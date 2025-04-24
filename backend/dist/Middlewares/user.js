"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleWare = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(400).json({
            message: "No token found"
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        //@ts-ignore
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_USERS_PASSWORD);
        //@ts-ignore
        req.userId = decoded.id;
        next();
    }
    catch (e) {
        res.status(500).json({ message: 'internal server error' });
    }
};
exports.userMiddleWare = userMiddleWare;
