import crypto from "crypto";
import { RowDataPacket } from "mysql2";
import { orderRepository } from "../repositories/order.repository";
import { getDb } from "../data/database";
import { OrderStatus } from "../types";
import { Cart } from "./cart.model";
import { User } from "./user.model";

export class Order {
  products: Cart;
  userData: User;
  status: OrderStatus;
  date: Date = new Date();
  formattedDate = this.date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  id?: string;
  constructor(
    cart: Cart,
    userData: User,
    status: OrderStatus = "pending",
    date: Date = new Date(),
    orderId?: string
  ) {
    this.products = cart;
    this.userData = userData;
    this.status = status;
    this.date = date;
    this.id = orderId;
  }

  save() {
    return orderRepository.saveToDb(this);
  }

  static async getAll() {
    return await orderRepository.getAll();
  }

  static async getAllForUser(userId: string) {
    return await orderRepository.getAllForUserId(userId);
  }

  static async getById(orderId: string) {
    return await orderRepository.getById(orderId);
  }
}
