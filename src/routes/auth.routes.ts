import express from 'express';
import { getLogin, getSignup, login, logout, signup } from '../controllers/auth.controller';

const router = express.Router();

router.get('/signup', getSignup)

router.post('/signup', signup)

router.get('/login', getLogin)

router.post('/login', login)
router.post('/logout', logout)

export default router;