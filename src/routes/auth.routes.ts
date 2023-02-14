import express from 'express';
import { getLogin, getSignup, signup } from '../controllers/auth.controller';

const router = express.Router();

router.get('/signup', getSignup)

router.post('/signup', signup)

router.get('/login', getLogin)

export default router;