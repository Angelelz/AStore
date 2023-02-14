import { ErrorRequestHandler } from "express";


export const handleErrors: ErrorRequestHandler = (error, req, res, next) => {
  console.log(error);
  res.status(500).render('shared/500');
}