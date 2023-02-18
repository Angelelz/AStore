import { cartRepository } from "../repositories/cart.repository";
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

  static async getByCartId(cartId: string) {
    return cartRepository.getCartItemsByCartId(cartId);
  }

  static createFromCartItem(item: {
    product: Product;
    quantity: number;
    cartId?: string;
    id?: string;
  }) {
    const cartItem = new CartItem(item.product, item.quantity);
    cartItem.cartId = item.cartId;
    cartItem.id = item.id;
    return cartItem;
  }

  async save(cartId: string) {
    await cartRepository.saveCartItemToDb(this, cartId);
  }

  async addQuantity(quantity: number) {
    this.quantity += quantity;
    this.totalPrice += quantity * this.product.price;
    this.updateQuantity();
  }

  async updateQuantity() {
    cartRepository.updateCartItemData(this);
  }

  delete() {
    if (!this.id) {
      throw new Error("The instance of the class has to have an ID");
    }
    cartRepository.deleteCartItem(this.id);
  }
}

export class Cart {
  items: CartItem[];
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
    });
  }

  async updatePrices() {
    const productIds = this.items.map(function (item) {
      return item.product.id!;
    });

    const products = await Product.getMultiple(productIds);
    const deletableCartItemProductIds: string[] = [];

    for (const cartItem of this.items) {
      const product = products.find(function (prod) {
        return prod.id === cartItem.product.id;
      });

      if (!product) {
        // product was deleted!
        // "schedule" for removal from cart
        deletableCartItemProductIds.push(cartItem.product.id!);
        continue;
      }

      // product was not deleted
      // set product data and total price to latest price from database
      cartItem.product = product;
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
    }

    if (deletableCartItemProductIds.length > 0) {
      this.items = this.items.filter(function (item) {
        return deletableCartItemProductIds.indexOf(item.product.id!) < 0;
      });
    }

    // re-calculate cart totals
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) {
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
    await this.save();
  }

  static async getById(cartId: string) {
    const cartItems = await CartItem.getByCartId(cartId);
    return new Cart(cartItems, cartId);
  }

  save() {
    cartRepository.saveToDb(this);
  }

  async addQuantity(quantity: number, price: number) {
    this.totalQuantity += quantity;
    this.totalPrice += quantity * price;
    const updateData = [this.totalQuantity, this.totalPrice, this.id];
    await this.updateQuantity();
  }

  async updateQuantity() {
    cartRepository.updateQuantity(this);
  }

  async addToCart(item: Product, quantity = 1) {
    const itemIndex = this.items.findIndex(
      (cartItem) => cartItem.product.id === item.id
    );
    if (itemIndex >= 0) {
      // this.items[itemIndex].quantity += quantity;
      // this.items[itemIndex].totalPrice += (quantity * item.price);
      await this.items[itemIndex].addQuantity(quantity);
      // this.totalQuantity += quantity;
      // this.totalPrice += (quantity * item.price);
      // getDb().query('UPDATE cartItems SET quantity = ?, totalPrice = ?', [this.items[itemIndex].quantity, this.items[itemIndex].totalPrice])
      await this.addQuantity(quantity, item.price);

      return;
    }
    const newCartItem = new CartItem(item, quantity);
    await newCartItem.save(this.id!);
    this.items.push(newCartItem);
    await this.addQuantity(quantity, item.price);
  }

  async updateItem(productId: string, newQuantity: number) {
    const itemIndex = this.items.findIndex(
      (cartItem) => cartItem.product.id === productId
    );
    if (itemIndex < 0) {
      return;
    }

    const item = this.items[itemIndex];
    if (newQuantity > 0) {
      const quantityChange = newQuantity - item.quantity;
      item.quantity = newQuantity;
      item.totalPrice = newQuantity * item.product.price;

      this.totalQuantity = this.totalQuantity + quantityChange;
      this.totalPrice += quantityChange * item.product.price;
      await item.updateQuantity();
      await this.updateQuantity();
      return {
        updatedItemPrice: item.totalPrice,
      };
    }

    const [deletedItem] = this.items.splice(itemIndex, 1);
    this.totalQuantity = this.totalQuantity - item.quantity;
    this.totalPrice -= item.totalPrice;
    await this.updateQuantity();
    deletedItem.delete();
    return {
      updatedItemPrice: 0,
    };
  }
}
