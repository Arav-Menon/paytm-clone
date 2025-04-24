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
exports.amountRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../Middlewares/user");
const db_1 = require("../db");
const db_2 = require("../db");
exports.amountRouter = express_1.default.Router();
//@ts-ignore
exports.amountRouter.post('/transfer', user_1.userMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receiverId, bankName, amount } = req.body;
        //@ts-ignore
        const senderId = req.userId;
        const receiver = yield db_1.UsersSchema.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        if (receiver.bankName !== bankName) {
            return res.status(400).json({
                message: "Bank name doesn't match"
            });
        }
        const sender = yield db_1.UsersSchema.findById(senderId);
        if (!sender || sender.balance < amount) {
            return res.json({ message: "Insufficient balance" });
        }
        sender.balance -= amount;
        receiver.balance += amount;
        yield sender.save();
        yield receiver.save();
        yield db_2.AccountSchema.create({
            sender: sender._id,
            receiver: receiver._id,
            amount,
            message: "Sent via Paytm Clone"
        });
        res.json({
            message: `${amount} is transfer to ${receiver} `
        });
    }
    catch (e) {
        console.log(e);
    }
}));
exports.amountRouter.get("/transactions", (req, res) => {
    //to get history of payments
    res.json('working');
});
