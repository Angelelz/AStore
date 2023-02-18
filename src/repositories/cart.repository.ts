import crypto from "crypto";
import { Product } from "../models/products.model";
import { getDb } from "../data/database";
import { CartItem, Cart } from "../models/cart.model";
import {
  CartRepository,
  DatabaseCartItem,
  DatabaseProduct,
  DBProduct,
} from "../types";

const createCartItemFromQuery = (queryResult: CartItemsJoinProducts) => {
  const product = new Product({
    title: queryResult.title,
    summary: queryResult.summary,
    price: +queryResult.price,
    description: queryResult.description,
    image: queryResult.image,
    id: queryResult.id,
  } as DBProduct);

  return CartItem.createFromCartItem({
    product,
    cartId: queryResult.cartId,
    quantity: queryResult.quantity,
    id: queryResult.id,
  });
};

interface CartItemsJoinProducts extends DatabaseCartItem, DatabaseProduct {}

export const cartRepository: CartRepository = {
  getCartItemsByCartId: async function (cartId: string): Promise<CartItem[]> {
    const [cartItems] = await getDb().query<CartItemsJoinProducts[]>(
      "SELECT * FROM cartItems LEFT JOIN products ON cartItems.productId = products.id WHERE cartItems.cartId = ?",
      [cartId]
    );
    return cartItems.map((item) => createCartItemFromQuery(item));
  },

  saveCartItemToDb: async function (
    cartItem: CartItem,
    cartId: string
  ): Promise<void> {
    cartItem.id = crypto.randomUUID();
    cartItem.cartId = cartId;

    const cartItemValues = [
      cartItem.id,
      cartItem.quantity,
      cartItem.totalPrice,
      cartItem.product.id,
      cartId,
    ];

    await getDb().query(
      "INSERT INTO cartItems (`id`, `quantity`, `totalPrice`, `productId`, `cartId`) VALUES (?)",
      [cartItemValues]
    );
  },

  updateCartItemData: async function (cartItem: CartItem): Promise<void> {
    const updateData = [cartItem.quantity, cartItem.totalPrice, cartItem.id];
    await getDb().query(
      "UPDATE `cartItems` SET `quantity` = ?, `totalPrice` = ? WHERE `id` = ?",
      updateData
    );
  },

  deleteCartItem: async function (cartItemId: string): Promise<void> {
    getDb().query("DELETE FROM `cartItems` WHERE `id` = ?", [cartItemId]);
  },

  saveToDb: async function (cart: Cart): Promise<void> {
    if (!cart.id) {
      cart.id = crypto.randomUUID();
      const insertData = [[cart.id, cart.totalQuantity, cart.totalPrice]];
      getDb().query(
        "INSERT INTO carts (`id`, `totalQuantity`, `totalPrice`) VALUES (?)",
        insertData
      );
    } else {
      for (const item of cart.items) {
        item.updateQuantity();
      }
      cart.updateQuantity();
    }
  },

  updateQuantity: async function (cart: Cart): Promise<void> {
    const updateData = [cart.totalQuantity, cart.totalPrice, cart.id];
    await getDb().query(
      "UPDATE `carts` SET `totalQuantity` = ?, `totalPrice` = ? WHERE `id` = ?",
      updateData
    );
  },
};
