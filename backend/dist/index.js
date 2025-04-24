"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./routes/user");
const amount_1 = require("./routes/amount");
const db_1 = require("./db");
const app = (0, express_1.default)();
(0, db_1.connectDB)();
app.use(express_1.default.json());
app.use("/api/v1/user", user_1.userRouter);
app.use("/api/v1/amount", amount_1.amountRouter);
app.listen(8000, () => {
    console.log('Server is running');
});
