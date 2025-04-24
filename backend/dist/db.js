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
exports.AccountSchema = exports.UsersSchema = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const { Schema } = mongoose_1.default;
dotenv_1.default.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        yield mongoose_1.default.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB is connected successfully');
    }
    catch (error) {
        console.error(`failed ${error}`);
        process.exit(1);
    }
    ;
});
exports.connectDB = connectDB;
const usersSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
    }
});
const transferSchema = new Schema({
    receiverId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
    },
    bankName: {
        type: String,
        ref: "User",
    },
    userId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
    },
    amount: {
        type: Number,
        required: true,
    }
});
exports.UsersSchema = mongoose_1.default.model('User', usersSchema);
exports.AccountSchema = mongoose_1.default.model('Account', transferSchema);
