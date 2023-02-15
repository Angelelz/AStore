import { RequestHandler } from "express"
import { Product } from "../models/products.model";

export const getProducts: RequestHandler = (req, res) => {
  res.render('admin/products/all-products');
}

export const getNewProduct: RequestHandler = (req, res) => {
  res.render('admin/products/new-product')
}

export const createNewProduct: RequestHandler = async (req, res, next) => {
  const product = new Product({
    ...req.body,
    image: req.file!.filename
  })
  
  try {
    await product.save()
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}