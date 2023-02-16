import { RequestHandler } from "express";
import { Cart } from "../models/cart.model";

export const initializeCart: RequestHandler = (req, res, next) => {
  let cart: Cart;

  if (!req.session.cart) {
    cart = new Cart()
  } else {
    cart = new Cart(req.session.cart.items)
  }
  
  res.locals.cart = cart;
  next();
}