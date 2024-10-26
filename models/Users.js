import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
}, {collection: "Users"});

const Users = mongoose.model("Users", userSchema);

export default Users;