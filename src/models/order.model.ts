import { getDb } from "../data/database";
import { DBUser, OrderStatus } from "../types";
import { Cart } from "./cart.model";

export class Order {
  products: Cart;
  userData: DBUser;
  status: OrderStatus;
  date: Date = new Date();
  formattedDate = this.date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  id?: string;
  constructor(cart: Cart, userData: DBUser, status: OrderStatus = 'pending', date: string, orderId?: string) {
    this.products = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);
    this.id = orderId
  }

  save() {
    if (this.id) {
    } else {
      // getDb().query()
    }
  }
}