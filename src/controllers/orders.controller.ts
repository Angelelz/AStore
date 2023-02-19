import { RequestHandler } from "express";
import Stripe from 'stripe';
import { User } from "../models/user.model";
import { Order } from "../models/order.model";

const stripe = new Stripe('sk_test_51MczZ4Dns9DTlJVqiOJnJnj1J9o64pWGNBuf6YbNI48UuRE0hhBoOnXrthj8Z2JDkxEwhgbRfuYYjV5D6ox0vK7N00E4gUbcZV', {
  apiVersion: '2022-11-15'
});

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

  const session = await stripe.checkout.sessions.create({
    line_items: order.products.items.map(item => ({
      // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.title,
        },
        unit_amount: +item.product.price.toFixed(2) * 100
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `http://localhost:3000/orders/success`,
    cancel_url: `http://localhost:3000/orders/cancel`,
  });

  res.redirect(303, session.url!);

  // res.redirect("/orders");
};

export const getSuccess: RequestHandler = (req, res, next) => {
  res.render('customer/orders/success')
}

export const getCancel: RequestHandler = (req, res, next) => {
  res.render('customer/orders/cancel')
}