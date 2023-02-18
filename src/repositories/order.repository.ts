import crypto from "crypto";
import { Cart, CartItem } from "../models/cart.model";
import { User } from "../models/user.model";
import { getDb } from "../data/database";
import { Order } from "../models/order.model";
import {
  DatabaseAddress,
  DatabaseCart,
  DatabaseCartItem,
  DatabaseOrder,
  DatabaseProduct,
  DatabaseUser,
  DBProduct,
  OrderRepository,
} from "../types";
import { Product } from "../models/products.model";
import { OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";

interface JoinedOrder extends RowDataPacket {
  orders: DatabaseOrder;
  carts: DatabaseCart;
  cartItems: DatabaseCartItem;
  products: DatabaseProduct;
  users: DatabaseUser;
  addresses: DatabaseAddress;
}

const createOrderFromQuery = (query: JoinedOrder[]) => {
  // if (query.length === 0)
  // console.log(query)
  const dbUser = query[0].users;
  const address = query[0].addresses;
  const auser = new User(
    dbUser.email,
    "-",
    dbUser.name,
    address.street,
    address.postalCode,
    address.city,
    dbUser.id
  );
  const cartItems = query.reduce((prev, subOrder) => {
    if (!subOrder.products.id) return prev;
    const product = new Product({
      title: subOrder.products.title,
      summary: subOrder.products.summary,
      price: +subOrder.products.price,
      description: subOrder.products.description,
      image: subOrder.products.image,
      id: subOrder.products.id,
    } as DBProduct);
    prev.push(
      CartItem.createFromCartItem({
        product,
        quantity: subOrder.cartItems.quantity,
        cartId: subOrder.cartItems.cartId,
        id: subOrder.cartItems.id,
      })
    );
    return prev;
  }, new Array<CartItem>());
  const dbcart = new Cart(cartItems, query[0].carts.id);
  const order = new Order(
    dbcart,
    auser,
    query[0].orders.status,
    query[0].orders.date,
    query[0].orders.id
  );
  return order;
};

const groupOrdersById = (query: JoinedOrder[]) => {
  const newQuery = query.reduce((prev, curr) => {
    const index = prev.findIndex((i) => i[0]?.orders.id === curr.orders.id);
    if (index < 0) {
      prev.push([curr]);
    } else {
      [prev[index].push(curr)];
    }
    return prev;
  }, new Array<JoinedOrder[]>());

  return newQuery;
};

export const orderRepository: OrderRepository = {
  saveToDb: function (order: Order): Promise<any> {
    if (order.id) {
      const res = getDb().query<ResultSetHeader>(
        "UPDATE orders SET status = ? WHERE id = ?",
        [order.status, order.id]
      );
      // console.log(res)
      return res;
    } else {
      order.id = crypto.randomUUID();
      const insertData = [
        [
          order.id,
          order.date,
          order.status,
          order.userData.id,
          order.products.id,
        ],
      ];

      return getDb().query<OkPacket[]>(
        "INSERT INTO orders (`id`, `date`, `status`, `userId`, `cartId`) VALUES (?)",
        insertData
      );
    }
  },

  getAll: async function (): Promise<Order[]> {
    const queryArr = (
      await getDb().query<JoinedOrder[]>({
        sql: `SELECT * FROM orders
        LEFT JOIN carts ON orders.cartId = carts.id
        LEFT JOIN cartItems ON cartItems.cartId = carts.id
        LEFT JOIN products ON cartItems.productId = products.id
        LEFT JOIN users ON orders.userId = users.id
        LEFT JOIN addresses ON addresses.userId = users.id;`,
        nestTables: true,
        rowsAsArray: true,
      })
    )[0];

    const newQuery = groupOrdersById(queryArr);

    return newQuery.map((query) => createOrderFromQuery(query));
  },
  getAllForUserId: async function (userId: string): Promise<Order[]> {
    const queryArr = (
      await getDb().query<JoinedOrder[]>({
        sql: `SELECT * FROM orders
        LEFT JOIN carts ON orders.cartId = carts.id
        LEFT JOIN cartItems ON cartItems.cartId = carts.id
        LEFT JOIN products ON cartItems.productId = products.id
        LEFT JOIN users ON orders.userId = users.id
        LEFT JOIN addresses ON addresses.userId = users.id
        WHERE orders.userId = ?;`,
        values: [userId],
        nestTables: true,
        rowsAsArray: true,
      })
    )[0];

    const newQuery = groupOrdersById(queryArr);

    return newQuery.map((query) => createOrderFromQuery(query));
  },
  getById: async function (orderId: string): Promise<Order> {
    const queryArr = (
      await getDb().query<JoinedOrder[]>({
        sql: `SELECT * FROM orders
        LEFT JOIN carts ON orders.cartId = carts.id
        LEFT JOIN cartItems ON cartItems.cartId = carts.id
        LEFT JOIN products ON cartItems.productId = products.id
        LEFT JOIN users ON orders.userId = users.id
        LEFT JOIN addresses ON addresses.userId = users.id
        WHERE orders.id = ?;`,
        values: [orderId],
        nestTables: true,
        rowsAsArray: true,
      })
    )[0];

    return createOrderFromQuery(queryArr);
  },
};
