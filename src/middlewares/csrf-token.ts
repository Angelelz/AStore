import { RequestHandler } from "express"
import core from 'express-serve-static-core'

export const addCSRFToken: RequestHandler = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
}