import { RequestHandler } from "express";

export const updateCartPrices: RequestHandler = async (req, res, next) => {
  const cart = res.locals.cart;

  await cart.updatePrices();
  req.session.cart = cart;
  next();
};
