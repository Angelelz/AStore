import { getDb } from "./database";
import session from "express-session";

var MySQLStore = require("express-mysql-session")(session);

var sessionStore = new MySQLStore({}, getDb());

export const createSessionConfig = () => {
  return {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  };
};
