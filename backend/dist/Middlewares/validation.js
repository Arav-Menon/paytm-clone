"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInputSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userInputSchema = zod_1.default.object({
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
