import { RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (req, res, next) => {
  res.status(404).render("shared/404");
};
