import express ,{ Request, Response } from "express";
import { userMiddleWare } from "../Middlewares/user";
import { UsersSchema } from "../db";
import { AccountSchema } from "../db";


export const amountRouter = express.Router();

//@ts-ignore
amountRouter.post('/transfer', userMiddleWare, async  (req : Request, res : Response) => {

   try {

    const { receiverId, bankName, amount} = req.body;

    //@ts-ignore
    const senderId = req.userId

    const receiver = await UsersSchema.findById(receiverId);

    if(!receiver) {
        return res.status(404).json({
            message : "User not found",
        })
    }

    if(receiver.bankName !== bankName ) {
        return res.status(400).json({
            message : "Bank name doesn't match"
        })
    }

    const sender = await UsersSchema.findById(senderId);

    if(!sender || sender.balance < amount ) {
        return res.json({ message : "Insufficient balance" })
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save()
    await receiver.save()

    await AccountSchema.create({
        sender: sender._id,
        receiver: receiver._id,
        amount,
        message: "Sent via Paytm Clone"
    })

    res.json({
        message : `${amount} is transfer to ${receiver} `
    })

   }catch(e) {
    console.log(e)
   }



})

amountRouter.get("/transactions", (req, res) => {
    //to get history of payments

    res.json('working');
})

