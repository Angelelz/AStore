import express from "express";
import { addOrder, getOrders } from "../controllers/orders.controller";

const router = express.Router();

router.get("/", getOrders);
router.post("/", addOrder);

export default router;
