import express from 'express';
const router = express.Router();
import { getAllQuotes, getRandomQuote } from '../controllers/quotes.js';


router.get('/quotes', getAllQuotes); //api/quotes
router.get('/quote', getRandomQuote) //api/quote

export default router;