import Users from "../models/Users.js";

export const getUserEntries = async (req, res) =>{
    try{
        const userId = req.user.userId;
        const user = await Users.findById(userId);
        if (!user){
            console.log("user not found searching entries");
            return res.status.json({success: false, message: "user not found searching entries"});
        }
        const allEntries = user.moodJournal;
        res.status(200).json({success: true, allEntries, message: "Got entries"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({success: false, message: error});
    }
}