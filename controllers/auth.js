import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Users from '../models/Users.js';
import dotenv from 'dotenv';
dotenv.config();
//register controller
export const register = async (req, res) =>{
    console.log("Registering in process...");
    try{
        const { email, firstName, lastName, username, password} = req.body;
        const usernameExists = await Users.findOne({ username: username });
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
        console.log("Registered Successfully!!!");

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
            console.log("user does not exist");
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

export const getName = async (req, res) =>{
    try{
        const userId = req.user.userId;
        const user = await Users.findById(userId);
        if (!user){
            console.log("cant find user while catching feelings");
            return res.status(404).json({success: true, message: "cant find user while catching feelings"});
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({success: false, message: error});
    }
}


// add entry
export const addEntry = async (req, res) =>{
    console.log("adding entry...");
    try{
        const { entry, mood } = req.body;
        const userId = req.user.userId;
        const user = await Users.findById(userId);
        if (!user){
            console.log("Couldn't find user");
            return res.status(404).json({success: false, message: "couldn't find user"});
        }
        const temp = {
            entry: entry,
            mood: mood
          };

        await Users.findByIdAndUpdate(
            userId,
            {$push: {moodJournal: temp}},
            {new: true}
        )
        res.status(200).json({success: true, message: "added journal entry"})

    }
    catch(error){
        console.log(error);
        res.status(500).json({success: false, message: error});
    }
};

export const getUser = async (req, res) =>{
    try{
        const userId = req.user.userId;
        const user = await Users.findById(userId);
        if (!user){
            console.log("Cant find user");
            return res.status(404).json({success: false, message: "cant find user"});
        }
        const firstName = user.firstName;
        return res.status(200).json({success: true, firstName, message: "Got first name of user"});

    }
    catch(error){
        console.log(error);
        res.status(500).json({success: false, message: error});
    }
}