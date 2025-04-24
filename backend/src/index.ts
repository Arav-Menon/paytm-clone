import express from 'express';
import { userRouter } from './routes/user';
import { amountRouter } from './routes/amount';
import { connectDB } from './db';

const app = express();

connectDB();    

app.use(express.json())

app.use("/api/v1/user", userRouter);
app.use("/api/v1/amount", amountRouter);


app.listen(8000, ()=> {
    console.log('Server is running');
})