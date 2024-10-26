import express from 'express';
const router = express.Router();
import { getUserEntries } from '../controllers/entry.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/entries/get', verifyToken, getUserEntries) //api/entries/get

export default router;