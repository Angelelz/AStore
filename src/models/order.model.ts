import crypto from 'crypto'
import { RowDataPacket } from 'mysql2';
import { getDb } from "../data/database";
import { OrderStatus } from "../types";
import { Cart } from "./cart.model";
import { User } from './user.model';

export class Order {
  products: Cart;
  userData: User;
  status: OrderStatus;
  date: Date = new Date();
  formattedDate = this.date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  id?: string;
  constructor(cart: Cart, userData: User, status: OrderStatus = 'pending', date: Date = new Date, orderId?: string) {
    this.products = cart;
    this.userData = userData;
    this.status = status;
    this.date = date;
    this.id = orderId
  }

  save() {
    if (this.id) {
      return getDb().query('UPDATE orders SET status = ? WHERE id = ?', [this.status, this.id])
    } else {
      this.id = crypto.randomUUID();
      const insertData = [[
        this.id,
        this.date,
        this.status,
        this.userData.id,
        this.products.id
      ]]
      
      return getDb().query('INSERT INTO orders (`id`, `date`, `status`, `userId`, `cartId`) VALUES (?)', insertData);
    }
  }

  // static transformOrderDocument(order: {productData: Cart, userData: DBUser, status: OrderStatus, date: Date, id: string }) {
  //   return new Order(
  //     order.productData,
  //     order.userData,
  //     order.status,
  //     order.date,
  //     order.id
  //   );
  // }

  // static transformOrderDocuments(orderDocs: any[]) {
  //   return orderDocs.map(this.transformOrderDocument);
  // }

  static async getAll() {
    const [DBOrder] = await getDb().query<RowDataPacket[]>('SELECT * FROM orders;');

    return await Promise.all((DBOrder as {id: string}[]).map(order => Order.getById(order.id)));
  }

  static async getAllForUser(userId: string) {

    const [DBOrder] = await getDb().query<RowDataPacket[]>('SELECT * FROM orders WHERE userId = ?', [userId]);

    return await Promise.all((DBOrder as {id: string}[]).map(order => Order.getById(order.id)));
  }

  static async getById(orderId: string) {
    const [DBOrder] = await getDb().query<RowDataPacket[]>('SELECT * FROM orders WHERE id = ?', [orderId]);
    const cart = await Cart.getById(DBOrder[0].cartId);
    const user = await User.getFullUserById(DBOrder[0].userId)
    return new Order(cart, user, DBOrder[0].status, DBOrder[0].date, DBOrder[0].id)
  }
}