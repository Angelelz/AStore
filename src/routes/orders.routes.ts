import express from "express";
import { addOrder, getCancel, getOrders, getSuccess } from "../controllers/orders.controller";

const router = express.Router();

router.get("/", getOrders);
router.post("/", addOrder);
router.get('/success', getSuccess)
router.get('/cancel', getCancel)

export default router;
