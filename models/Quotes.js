import mongoose from "mongoose";

const quotesSchema = new mongoose.Schema({
    quote: {type: String, required: true},
    author: {type: String, required: true}
}, {collection: "Quotes"});

const Quotes = mongoose.model("Quotes", quotesSchema);

export default Quotes;