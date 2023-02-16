import { RequestHandler } from "express"
import { Product } from "../models/products.model"

export const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await Product.getAll();
    res.render('customer/products/all-products', {products})
  } catch (error) {
    next(error);
  } 
}

export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await Product.getById(req.params.id);
    res.render('customer/products/product-detail', {product})
  } catch (error) {
    next(error);
  } 
}