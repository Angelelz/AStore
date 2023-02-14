"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogin = exports.signup = exports.getSignup = void 0;
const user_model_1 = require("../models/user.model");
const getSignup = (req, res) => {
    res.render("customer/auth/signup");
};
exports.getSignup = getSignup;
const signup = async (req, res) => {
    const user = new user_model_1.User(req.body.email, req.body.password, req.body.fullname, req.body.street, +req.body.postal, req.body.city);
    await user.signup();
    res.redirect('/login');
};
exports.signup = signup;
const getLogin = (req, res) => {
    res.render("customer/auth/login");
};
exports.getLogin = getLogin;
//# sourceMappingURL=auth.controller.js.map