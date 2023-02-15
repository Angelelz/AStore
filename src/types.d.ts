import express from 'express';
import { RowDataPacket } from 'mysql2';

declare module 'express-session' {
  interface SessionData {
    uid: string | null;
    isAdmin: 0 | 1;
    flashData?: any;
  }
}

export interface DBUser extends RowDataPacket {
  id: string,
  email: string,
  name: string,
  password: string,
  isAdmin: 0 | 1,
}

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
}

export type SignUpData = {
  email: string,
  ["confirm-email"]: string,
  password: string,
  fullname: string,
  street: string,
  postal: string,
  city: string,
}