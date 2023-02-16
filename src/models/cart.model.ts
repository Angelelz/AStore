import crypto from 'crypto'
import { getDb } from "../data/database";
import { Product } from "./products.model";

export class CartItem {
  product: Product;
  productId: string;
  quantity: number;
  totalPrice: number;
  id?: string;
  cartId?: string;
  constructor(product: Product, quantity = 1) {
    this.product = product;
    this.productId = product.id!;
    this.quantity = quantity;
    this.totalPrice = quantity * product.price;
  }
  static createFromCartItem(item: any) {
    const cartItem = new CartItem(item.product, item.quantity);
    cartItem.cartId = item.cartId;
    cartItem.id = item.id;
    return cartItem;
  }
  async save(cartId: string) {
    this.id = crypto.randomUUID();
    this.cartId = cartId;
    const cartItemValues = [
      this.id,
      this.quantity,
      this.totalPrice,
      this.product.id,
      cartId
    ]
    console.log("save cartItems", cartItemValues);
    await getDb().query('INSERT INTO cartItems (`id`, `quantity`, `totalPrice`, `productId`, `cartId`) VALUES (?)', [cartItemValues])
  }
  async addQuantity(quantity: number) {
    this.quantity += quantity;
    this.totalPrice += (quantity * this.product.price)
    const updateData = [this.quantity, this.totalPrice, this.id]
    console.log("cartItems addQuantity", updateData);
    getDb().query('UPDATE cartItems SET `quantity` = ?, `totalPrice` = ? WHERE `id` = ?', updateData)
  }
  
  delete() {
    console.log("cartItems delete", [this.id]);
    getDb().query('DELETE FROM `cartItems` WHERE `id` = ?', [this.id])
  }
}

export class Cart {
  items: CartItem[]
  totalQuantity: number = 0;
  totalPrice: number = 0;
  id?: string;
  constructor(items: CartItem[] = [], id?: string) {
    this.items = items;
    this.id = id;
    items.forEach((item, index) => {
      this.totalPrice += item.totalPrice;
      this.totalQuantity += item.quantity;
      this.items[index] = CartItem.createFromCartItem(item);
    })
  }

  save() {
    if (!this.id) {
      this.id = crypto.randomUUID();
      const insertData = [[this.id, this.totalQuantity, this.totalPrice]]
      console.log("carts save", insertData)
      return getDb().query('INSERT INTO carts (`id`, `totalQuantity`, `totalPrice`) VALUES (?)', insertData);
    }
  }

  async addQuantity(quantity: number, price: number) {
    this.totalQuantity += quantity;
    this.totalPrice += (quantity * price);
    const updateData = [this.totalQuantity, this.totalPrice, this.id ]
    console.log("carts addQuantity", updateData)
    await getDb().query('UPDATE `carts` SET `totalQuantity` = ?, `totalPrice` = ? WHERE `id` = ?', updateData)
  }

  async updateQuantity() {
    const updateData = [this.totalQuantity, this.totalPrice, this.id ]
    console.log("carts updateQuantity", updateData)
    await getDb().query('UPDATE `carts` SET `totalQuantity` = ?, `totalPrice` = ? WHERE `id` = ?', updateData)
  }

  async addToCart(item: Product, quantity = 1) {
    const itemIndex = this.items.findIndex((cartItem) => cartItem.product.id === item.id)
    if (itemIndex >= 0) {
      // this.items[itemIndex].quantity += quantity;
      // this.items[itemIndex].totalPrice += (quantity * item.price);
      await this.items[itemIndex].addQuantity(quantity)
      // this.totalQuantity += quantity;
      // this.totalPrice += (quantity * item.price);
      // getDb().query('UPDATE cartItems SET quantity = ?, totalPrice = ?', [this.items[itemIndex].quantity, this.items[itemIndex].totalPrice])
      await this.addQuantity(quantity, item.price)

      return;
    }
    const newCartItem = new CartItem(item, quantity);
    await newCartItem.save(this.id!);
    this.items.push(newCartItem);
    await this.addQuantity(quantity, item.price)
  }

  async updateItem(productId: string, newQuantity: number) {
    const itemIndex = this.items.findIndex((cartItem) => cartItem.product.id === productId);
    if (itemIndex < 0) {
      return;
    }
    
    const item = this.items[itemIndex]
    if (newQuantity > 0) { // Need to fix this
      // const quantityChange = newQuantity - item.quantity;
      // cartItem.quantity = newQuantity;
      // cartItem.totalPrice = newQuantity * cartItem.product.price;
      // this.items[itemIndex] = cartItem;

      // this.totalQuantity = this.totalQuantity + quantityChange;
      // this.totalPrice += quantityChange * cartItem.product.price;
      await item.addQuantity(newQuantity);
      await this.addQuantity(newQuantity, item.product.price)
      return {
        updatedItemPrice: item.totalPrice
      }
    }

    const [deletedItem] = this.items.splice(itemIndex, 1);
    this.totalQuantity = this.totalQuantity - item.quantity;
    this.totalPrice -= item.totalPrice;
    await this.updateQuantity();
    deletedItem.delete();
    return {
      updatedItemPrice: 0
    }
    
  }
}