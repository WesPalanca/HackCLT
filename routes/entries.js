import express from 'express';
const router = express.Router();
import { deleteEntry, getSingleUserEntry, getUserEntries } from '../controllers/entry.js';
import { verifyToken } from '../middleware/auth.js';

router.get('/entries/get', verifyToken, getUserEntries); //api/entries/get
router.get('/entry/single', verifyToken, getSingleUserEntry); //api/entry/single
router.delete('/entry/delete', verifyToken, deleteEntry); //api/entry/delete

export default router;