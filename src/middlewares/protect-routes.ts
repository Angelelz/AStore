import { RequestHandler } from "express";

export const protectRoutes: RequestHandler = (req, res, next) => {
  if (!res.locals.isAuth) {
    return res.redirect('/401')
  }

  if (req.path.startsWith('/admin') && !res.locals.isAdmin) {
    return res.redirect('/403')
  }

  next();
}