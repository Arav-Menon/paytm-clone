import mongoose from "mongoose";
import dotenv from 'dotenv';

const { Schema } = mongoose;

dotenv.config()

export const connectDB = async () => {
    try {
        //@ts-ignore
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB is connected successfully');
    } catch (error) {
        console.error(`failed ${error}`);
        process.exit(1);
    };
};


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

    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    receiverId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },

    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true,
    }
})

export const UsersSchema = mongoose.model('User', usersSchema)
const AccountSchema = mongoose.model('Account', transferSchema)

