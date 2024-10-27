import Users from "../models/Users.js";

export const getUserEntries = async (req, res) =>{
    try{
        const userId = req.user.userId;
        const user = await Users.findById(userId);
        if (!user){
            console.log("user not found searching entries");
            return res.status(404).json({success: false, message: "user not found searching entries"});
        }
        const allEntries = user.moodJournal;
        res.status(200).json({success: true, allEntries, message: "Got entries"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({success: false, message: error});
    }
}

export const getSingleUserEntry = async (req, res) =>{
    try{
        const userId = req.user.userId;
        const user = await Users.findById(userId);
        const entryId = req.query.entryId;
        if (!user){
            console.log("couldn't find user getting single user entry");
            return res.status(404).json({success: false, message: "couldn't find user getting single user entry"});
        }
        const entry = user.moodJournal.id(entryId);
        if (!entry) {
            return res.status(404).json({ success: false, message: "Entry not found for this user" });
        }
        return res.status(200).json({ success: true, entry, message: "got single user entry" });
        
        

    }
    catch(error){
        console.log(error);
        res.status(500).json({success: true, message: error})
    }
}