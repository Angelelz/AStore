import express from "express";
import { FieldPacket, RowDataPacket } from "mysql2";
import { Cart, CartItem } from "./models/cart.model";
import { Order } from "./models/order.model";
import { Product } from "./models/products.model";
import { User } from "./models/user.model";

declare module "express-session" {
  interface SessionData {
    uid?: string | null;
    isAdmin?: 0 | 1;
    flashData?: any;
    cart?: Cart;
  }
}

declare module "express-serve-static-core" {
  interface Locals {
      uid: string;
      isAuth: boolean;
      isAdmin: boolean;
      cart: Cart;
      csrfToken: string;
  }
}

export interface DBUser extends RowDataPacket {
  id: string;
  email: string;
  name: string;
  isAdmin: 0 | 1;
}

export type OrderStatus = 'pending' | 'fulfilled' | 'cancelled';

export interface DBProduct extends RowDataPacket {
  title: string;
  summary: string;
  price: number | string;
  description: string;
  image: string;
}

export interface DatabaseUser extends RowDataPacket {
  id: string,
  email: string,
  name: string,
  password: string,
  isAdmin: 0 | 1,
}

export interface DatabaseAddress extends RowDataPacket {
  id: string,
  street: string,
  city: string,
  postalCode: number,
  userId: string
}

export interface DatabaseProduct extends RowDataPacket {
  id: string,
  title: string,
  summary: string,
  price: string,
  description: string,
  image: string
}

export interface DatabaseCartItem extends RowDataPacket {
  id: string,
  quantity: number,
  totalPrice: string,
  productId: string,
  cartId: string
}

export interface DatabaseCart extends RowDataPacket {
  id: string,
  totalQuantity: number,
  totalPrice: string
}

export interface DatabaseOrder extends RowDataPacket {
  id: string,
  date: Date,
  status: OrderStatus,
  updatedAt: Date,
  userId: string,
  cartId: string
}

export type ProductData = DBProduct & {
  imagePath: string;
  imageUrl: string;
};

export type SignUpData = {
  email: string;
  ["confirm-email"]: string;
  password: string;
  fullname: string;
  street: string;
  postal: string;
  city: string;
};

export interface UserRepository {
  getUserByEmail: (email: string) => Promise<DatabaseUser>,
  getById: (userId: string) => Promise<DBUser>,
  getFullUserById: (userId: string) => Promise<User>,
  addToDb: (user: User) => Promise<void>,
  emailExists: (email: string) => Promise<boolean>,
}

export interface ProductRepository {
  getById(productId: string): Promise<Product>,
  getManyByIds(ids: string[]): Promise<Product[]>,
  getAll(): Promise<Product[]>,
  saveToDb(product: Product): Promise<void>,
  removeFromDb(productId?: string): Promise<void>
}

export interface CartRepository {
  // getCartItemById(cartItemId: string): Promise<CartItem>,
  // getAllCartItems(): Promise<CartItem[]>,
  getCartItemsByCartId(cartId: string): Promise<CartItem[]>,
  saveCartItemToDb(cartItem: CartItem, cartId: string): Promise<void>,
  updateCartItemData(cartItem: CartItem): Promise<void>,
  deleteCartItem(cartItemId: string): Promise<void>,
  saveToDb(cart: Cart): Promise<void>,
  updateQuantity(cart: Cart): Promise<void>,
}

export interface OrderRepository {
  saveToDb(order: Order): Promise<any[]>,
  getAll(): Promise<Order[]>,
  getAllForUserId(userId: string): Promise<Order[]>,
  getById(orderId: string): Promise<Order>,
}