import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

export const userMiddleWare = (req : Request, res : Response, next : NextFunction) => {

    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(400).json({
            message : "No token found"
        })
    } 

    const token = authHeader.split(' ')[1];

    try {
        //@ts-ignore
        const decoded = jwt.verify(token, process.env.JWT_USERS_PASSWORD)

        //@ts-ignore
        req.userId = decoded.id

        next();
    }catch(e) {
        res.status(500).json({message : 'internal server error'})
    }


}