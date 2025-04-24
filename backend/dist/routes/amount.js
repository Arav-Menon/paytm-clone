"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.amountRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.amountRouter = (0, express_1.default)();
exports.amountRouter.post('/transfer', (req, res) => {
    //sending money to p1 to p2
    res.json('working');
});
exports.amountRouter.get("/transactions", (req, res) => {
    //to get history of payments
    res.json('working');
});
exports.amountRouter.get('/balance', (req, res) => {
    //to check blance
    res.json('working');
});
