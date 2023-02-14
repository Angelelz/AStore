import type { RequestHandler } from "express";
import { User } from "../models/user.model";

export const getSignup: RequestHandler = (req, res) => {
  res.render("customer/auth/signup");
};

export const signup: RequestHandler = async (req, res) => {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    +req.body.postal,
    req.body.city
  );

  await user.signup();

  res.redirect('/login')
};

export const getLogin: RequestHandler = (req, res) => {
  res.render("customer/auth/login");
};
