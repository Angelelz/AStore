import express from "express";
import { RowDataPacket } from "mysql2";
import { Cart } from "./models/cart.model";
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
  password: string;
  isAdmin: 0 | 1;
}

export type OrderStatus = 'pending' | 'fulfilled' | 'cancelled';

export interface DBProduct extends RowDataPacket {
  title: string;
  summary: string;
  price: number;
  description: string;
  image: string;
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
  getUserByEmail: (email: string) => Promise<DBUser>,
  getById: (userId: string) => Promise<DBUser>,
  getFullUserById: (userId: string) => Promise<User>,
  signup: (user: User) => Promise<void>,
  emailExists: (email: string) => Promise<boolean>,
}