import express from 'express';
const router = express.Router();
import { register, login, addEntry } from '../controllers/auth.js';
import { verifyToken } from '../middleware/auth.js';



router.post('/register', register); //api/auth/register

router.post('/login', login);
router.post('/entry/add', verifyToken, addEntry); //api/entry/add

export default router;