import { RequestHandler } from "express";

export const addOrder: RequestHandler = (req, res, next) => {
  const cart = res.locals.cart;

  
}