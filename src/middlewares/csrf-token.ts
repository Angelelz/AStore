import { RequestHandler } from "express";

export const addCSRFToken: RequestHandler = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};
