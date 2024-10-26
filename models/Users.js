import mongoose from "mongoose";

const moodJournalSchema = new mongoose.Schema({
    entry: {type: String, required: false},
    datastamp: {type: Date, default: Date.now}
});
const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    moodJournal: {
        default: [],
        type: [moodJournalSchema]


    }
}, {collection: "Users"});

const Users = mongoose.model("Users", userSchema);

export default Users;