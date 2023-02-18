import { RequestHandler } from "express";
import { User } from "../models/user.model";
import { Order } from "../models/order.model";

export const getOrders: RequestHandler = async (req, res, next) => {
  try {
    const orders = await Order.getAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const addOrder: RequestHandler = async (req, res, next) => {
  const cart = res.locals.cart;
  let dbUser: User;
  try {
    dbUser = await User.getFullUserById(res.locals.uid);
    console.log(dbUser);
  } catch (error) {
    return next(error);
  }
  const order = new Order(cart, dbUser);

  try {
    console.log(await order.save());
  } catch (error) {
    return next(error);
  }

  req.session.cart = undefined;

  res.redirect("/orders");
};
