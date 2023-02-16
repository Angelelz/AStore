import express from 'express';
import { addOrder } from '../controllers/orders.controller';

const router = express.Router();

router.post('/orders', addOrder)

export default router;