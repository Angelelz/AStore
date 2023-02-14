import express from 'express';
import { RowDataPacket } from 'mysql2';

declare module 'express-session' {
  interface SessionData {
    uid: string | null;
    flashData?: any;
  }
}

export interface DBUser extends RowDataPacket {
  id: string,
  email: string,
  name: string,
  password: string,
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