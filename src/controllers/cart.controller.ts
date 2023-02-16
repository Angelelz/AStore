import { RequestHandler } from "express";
import { Product } from "../models/products.model";

export const getCart: RequestHandler = (req, res) => {
  res.render('customer/cart/cart');
}

export const addCartItemPut: RequestHandler = async (req, res, next) => {
  let product: Product;
  try {
    product = await Product.getById(req.body.productId)
  } catch (error) {
    next(error);
    return;
  }

  const cart = res.locals.cart
  console.log("In add to cart put", cart)

  await cart.addToCart(product);
  req.session.cart = cart;

  res.status(201).json({
    message: 'Cart updated',
    newTotalItems: cart.totalQuantity
  })
}

export const addCartItemPost: RequestHandler = async (req, res, next) => {
  let product: Product;
  try {
    product = await Product.getById(req.body.productId)
  } catch (error) {
    next(error);
    return;
  }

  const cart = res.locals.cart

  await cart.addToCart(product);
  req.session.cart = cart;

  res.status(201).json({
    message: 'Cart updated',
    newTotalItems: cart.items.length
  })
}

export const updateCartItem: RequestHandler = async (req, res) => {
  const cart = res.locals.cart;

  const updatedItemData = await cart.updateItem(req.body.productId, +req.body.quantity);

  req.session.cart = cart;

  res.json({
    message: "Item updated!",
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData?.updatedItemPrice
    }
  })
}