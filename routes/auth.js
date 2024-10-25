import express from 'express';
const router = express.Router();
import { register, login, test } from '../controllers/auth.js';



router.post('/register', register); //api/auth/register

router.post('/login', login);

export default router;