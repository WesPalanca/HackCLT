import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Users from '../models/Users.js';
import dotenv from 'dotenv';
dotenv.config();
//register controller
export const test = async(req, res) =>{
    console.log("testing");
    const users = await Users.find();
    res.json(users);
}
export const register = async (req, res) =>{
    console.log("Registering in process...");
    try{
        const { email, firstName, lastName, username, password} = req.body;
        const usernameExists = await Users.findOne({username: username});
        const emailExists = await Users.findOne({email: email});
        if (usernameExists || emailExists){
            return res.status(404).json({success: false, message: "User already exists"});
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new Users({
            email: email,
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: hashedPassword
        })
        await newUser.save();
        res.status(200).json({success: true, message: "User registered successfully"});

    } catch(error){
        console.log("Error happened while registering!");
        res.status(500).json({success: false, message: "Something went wrong while registering user " + error});
    }
    
    
}


//login controller
export const login = async (req, res) =>{
    console.log("Logging in ...");
    try{
        const { username, password } = req.body;
        const secret = process.env.JWT_SECRET;
        const user = await Users.findOne({username: username});
        if(!user){
            return res.status(404).json({success: false, message: "user does not exist"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(401).json({success: false, message: "Invalid credentials"});
        }
        const token = jwt.sign({userId: user._id}, secret, {expiresIn: '5h'});
        return res.status(200).json({success: true, token, message: "Successfully logged in user"});
    
    } catch(error){
        console.log("Error happened while logging in!");
        res.status(500).json({success: false, message: "Something went wrong while logging in user " + error});
    }

}
