import { RequestHandler } from "express";
import { Cart } from "../models/cart.model";

export const initializeCart: RequestHandler = async (req, res, next) => {
  let cart: Cart;

  if (!req.session.cart) {
    cart = new Cart()
    await cart.save();
    req.session.cart = cart;
  } else {
    cart = new Cart(req.session.cart.items, req.session.cart.id)
  }
  
  res.locals.cart = cart;
  next();
}