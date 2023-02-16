import { DBProduct } from "../types";
import { Product } from "./products.model";

export class CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
  constructor(product: Product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
    this.totalPrice = quantity * product.price;
  }
}

export class Cart {
  items: CartItem[]
  totalQuantity: number = 0;
  totalPrice: number = 0;
  constructor(items: CartItem[] = []) {
    this.items = items;
    items.forEach((item) => {
      this.totalPrice += item.totalPrice;
      this.totalQuantity += item.quantity;
    })
  }

  addToCart(item: Product, quantity = 1) {
    const newCartItem = new CartItem(item, quantity);
    const itemIndex = this.items.findIndex((cartItem) => cartItem.product.id === item.id)
    if (itemIndex >= 0) {
      this.items[itemIndex].quantity += quantity;
      this.items[itemIndex].totalPrice += (quantity * item.price);
      this.totalQuantity += quantity;
      this.totalPrice += (quantity * item.price);

      return;
    }
    this.items.push(newCartItem);
    this.totalQuantity += quantity;
    this.totalPrice += (quantity * item.price);
  }

  updateItem(productId: string, newQuantity: number) {
    const itemIndex = this.items.findIndex((cartItem) => cartItem.product.id === productId);
    if (itemIndex < 0) {
      return;
    }
    
    const item = this.items[itemIndex]
    if (newQuantity > 0) {
      const cartItem = {...item}
      const quantityChange = newQuantity - item.quantity;
      cartItem.quantity = newQuantity;
      cartItem.totalPrice = newQuantity * cartItem.product.price;
      this.items[itemIndex] = cartItem;

      this.totalQuantity = this.totalQuantity + quantityChange;
      this.totalPrice += quantityChange * cartItem.product.price;
      console.log(this);
      return {
        updatedItemPrice: cartItem.totalPrice
      }
    }

    this.items.splice(itemIndex, 1);
    this.totalQuantity = this.totalQuantity - item.quantity;
    this.totalPrice -= item.totalPrice;
    return {
      updatedItemPrice: 0
    }
    
  }
}