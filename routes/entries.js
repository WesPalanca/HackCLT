import express from 'express';
const router = express.Router();
import { getSingleUserEntry, getUserEntries } from '../controllers/entry.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/entries/get', verifyToken, getUserEntries) //api/entries/get
router.get('/entry/single', verifyToken, getSingleUserEntry) //api/entry/single

export default router;