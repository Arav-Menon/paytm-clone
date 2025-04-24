import express ,{ Router } from "express";

export const amountRouter : Router = express();

amountRouter.post('/transfer', (req, res) => {
    //sending money to p1 to p2
    res.json('working');
})

amountRouter.get("/transactions", (req, res) => {
    //to get history of payments

    res.json('working');
})

amountRouter.get('/balance', (req, res) => {
    //to check blance
    
    res.json('working');
})
