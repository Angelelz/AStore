import type { RequestHandler } from "express";
import { createUserSession, deleteAuthSession } from "../util/authentication";
import { User } from "../models/user.model";
import { DatabaseUser, DBUser, SignUpData } from "../types";
import { confirmationMatches, isValidUserInfo } from "../util/validation";
import { flashDataToSession, getSessionFlashData } from "../util/session-flash";

export const getSignup: RequestHandler = (req, res) => {
  let sessionData = getSessionFlashData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      ["confirm-email"]: "",
      password: "",
      fullname: "",
      street: "",
      postal: "",
      city: "",
    };
  }

  res.render("customer/auth/signup", { inputData: sessionData });
};

export const signup: RequestHandler = async (req, res, next) => {
  const enteredData: SignUpData = {
    email: req.body.email,
    ["confirm-email"]: req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  if (
    !isValidUserInfo(enteredData) ||
    !confirmationMatches(req.body.email, req.body["confirm-email"])
  ) {
    flashDataToSession(
      req,
      {
        errorMessage:
          "Please check your input. Password must be at least 6 characters long. Postal code should be 5 characters long",
        ...enteredData,
      },
      () => res.redirect("/signup")
    );

    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    +req.body.postal,
    req.body.city
  );

  try {
    const userExists = await user.userExists();

    if (userExists) {
      flashDataToSession(
        req,
        {
          errorMessage: "User already exists. Try logging in",
          ...enteredData,
        },
        () => res.redirect("/signup")
      );
      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
  }

  res.redirect("/login");
};

export const login: RequestHandler = async (req, res, next) => {
  const enteredData = {
    email: req.body.email,
    password: req.body.password,
  };
  const user = new User(req.body.email, req.body.password);

  let dbUser: DatabaseUser;

  try {
    dbUser = await user.getUserByEmail();
  } catch (error) {
    next(error);
    return;
  }

  if (!dbUser) {
    flashDataToSession(
      req,
      {
        errorMessage: "Invalid credentials",
        ...enteredData,
      },
      () => res.redirect("/login")
    );
    return;
  }

  const passwordIsCorrect = await user.passwordMatch(dbUser.password);

  if (!passwordIsCorrect) {
    flashDataToSession(
      req,
      {
        errorMessage: "Invalid credentials",
        ...enteredData,
      },
      () => res.redirect("/login")
    );
    return;
  }

  createUserSession(req, dbUser, () => {
    res.redirect("/");
  });
};

export const logout: RequestHandler = (req, res) => {
  deleteAuthSession(req, () => res.redirect("/login"));
};

export const getLogin: RequestHandler = (req, res) => {
  let sessionData = getSessionFlashData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("customer/auth/login", { inputData: sessionData });
};
