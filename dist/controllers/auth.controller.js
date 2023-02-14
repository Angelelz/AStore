"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogin = exports.logout = exports.login = exports.signup = exports.getSignup = void 0;
const authentication_1 = require("../util/authentication");
const user_model_1 = require("../models/user.model");
const validation_1 = require("../util/validation");
const session_flash_1 = require("../util/session-flash");
const getSignup = (req, res) => {
    let sessionData = (0, session_flash_1.getSessionData)(req);
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
exports.getSignup = getSignup;
const signup = async (req, res, next) => {
    const enteredData = {
        email: req.body.email,
        ["confirm-email"]: req.body["confirm-email"],
        password: req.body.password,
        fullname: req.body.fullname,
        street: req.body.street,
        postal: req.body.postal,
        city: req.body.city,
    };
    if (!(0, validation_1.isValidUserInfo)(enteredData) ||
        !(0, validation_1.confirmationMatches)(req.body.email, req.body["confirm-email"])) {
        (0, session_flash_1.flashDataToSession)(req, {
            errorMessage: "Please check your input. Password must be at least 6 characters long. Postal code should be 5 characters long",
            ...enteredData
        }, () => res.redirect("/signup"));
        return;
    }
    const user = new user_model_1.User(req.body.email, req.body.password, req.body.fullname, req.body.street, +req.body.postal, req.body.city);
    try {
        const userExists = await user.userExists();
        if (userExists) {
            (0, session_flash_1.flashDataToSession)(req, {
                errorMessage: "User already exists. Try logging in",
                ...enteredData
            }, () => res.redirect("/signup"));
            return;
        }
        await user.signup();
    }
    catch (error) {
        next(error);
    }
    res.redirect("/login");
};
exports.signup = signup;
const login = async (req, res, next) => {
    const enteredData = {
        email: req.body.email,
        password: req.body.password,
    };
    const user = new user_model_1.User(req.body.email, req.body.password);
    let dbUser;
    try {
        dbUser = await user.getUserByEmail();
    }
    catch (error) {
        next(error);
        return;
    }
    if (!dbUser) {
        (0, session_flash_1.flashDataToSession)(req, {
            errorMessage: "Invalid credentials",
            ...enteredData
        }, () => res.redirect("/login"));
        return;
    }
    const passwordIsCorrect = await user.passwordMatch(dbUser.password);
    if (!passwordIsCorrect) {
        (0, session_flash_1.flashDataToSession)(req, {
            errorMessage: "Invalid credentials",
            ...enteredData
        }, () => res.redirect("/login"));
        return;
    }
    (0, authentication_1.createUserSession)(req, dbUser, () => {
        res.redirect("/");
    });
};
exports.login = login;
const logout = (req, res) => {
    (0, authentication_1.deleteAuthSession)(req, () => res.redirect("/login"));
};
exports.logout = logout;
const getLogin = (req, res) => {
    let sessionData = (0, session_flash_1.getSessionData)(req);
    if (!sessionData) {
        sessionData = {
            email: "",
            password: "",
        };
    }
    res.render("customer/auth/login", { inputData: sessionData });
};
exports.getLogin = getLogin;
//# sourceMappingURL=auth.controller.js.map