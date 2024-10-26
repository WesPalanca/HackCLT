import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const verifyToken = async (req,res,next) =>{
    try{
        const token = req.header("Authorization");
        const secret = process.env.JWT_SECRET;
        if(!token){
            console.log('Access Denied');
            return res.status(401).send('Access Denied');
        }
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, secret);
        req.user = verified;
        next();
    }
    catch(error){
        console.log("Error happened");
        res.status(500).json({message: error});
    }
}