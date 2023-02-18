import express from "express";
import {
  addCartItemPut,
  addCartItemPost,
  getCart,
  updateCartItem,
} from "../controllers/cart.controller";

const router = express.Router();

router.get("/", getCart);
router.put("/items", addCartItemPut);
router.post("/items", addCartItemPost);
router.patch("/items", updateCartItem);

export default router;
