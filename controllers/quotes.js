import Quotes from "../models/Quotes.js";

export const getAllQuotes = async (req, res) =>{
    try{
        const quotes = await Quotes.find({});
        res.status(200).json(quotes);

    }
    catch(error){
        console.log("All Quotes Error");
        res.status(500).json({success: false, message: error});
    }
}

export const getRandomQuote = async (req, res) => {
    try {
        const [randomQuote] = await Quotes.aggregate([{ $sample: { size: 1 } }]);
        res.status(200).json({success: true, randomQuote});
    } catch (error) {
        console.log("Random Quote Error");
        res.status(500).json({ success: false, message: error });
    }
};    

