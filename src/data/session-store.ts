import { getDb } from "./database";

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options = {
	// host: 'localhost',
	// port: 3306,
	// user: 'session_test',
	// password: 'password',
	// database: 'session_test'

};

var sessionStore = new MySQLStore(options, getDb());

export const createSessionConfig = () => {
  return {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000*60*60*24,
    }
  }
}