import { RequestHandler } from "express"
import { Product } from "../models/products.model";

export const getProducts: RequestHandler = async (req, res, next) => {
  let products: Product[]
  console.log("here")
  try {
    products = await Product.getAll();
    console.log(products)
  } catch (error) {
    next(error);
    return;
  }
  res.render('admin/products/all-products', {products});
}

export const getNewProduct: RequestHandler = async (req, res, next) => {
  
  res.render('admin/products/new-product');
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

export const getUpdateProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await Product.getById(req.params.id);
    res.render('admin/products/update-product', {product})
  } catch (error) {
    next(error);
    return;
  }
}

export const updateProduct: RequestHandler = async (req, res, next) => {
  console.log(req.body)
  const product = new Product({
    ...req.body,
    id: req.params.id
  })

  if (req.file) {
    product.replaceImage(req.file.filename);
  }

  
  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}

export const deleteProductDelete: RequestHandler = async (req, res, next) => {
  let product: Product;

  try {
    product = await Product.getById(req.params.id);
    await product.remove();
  } catch (error) {
    return next(error)
  }

  res.json({message: "Deleted product"});
}

export const deleteProductPost: RequestHandler = async (req, res, next) => {
  let product: Product;

  try {
    product = await Product.getById(req.params.id);
    await product.remove();
  } catch (error) {
    return next(error)
  }

  res.redirect('/admin/products')
}