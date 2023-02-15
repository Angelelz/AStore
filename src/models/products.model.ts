import { getDb } from "../data/database";
import crypto from 'crypto'
import { DBProduct, DBUser } from "../types";

export class Product {
  title: string;
  summary: string;
  price: number;
  description: string;
  image: string;
  imagePath: string;
  imageUrl: string;

  constructor(productData: DBProduct) {
    this.title = productData.title
    this.summary = productData.summary
    this.price = +productData.price
    this.description = productData.description
    this.image = productData.image
    this.imagePath = `product-data/images/${productData.image}`;
    this.imageUrl = `/products/assets/images/${productData.image}`;
  }

  async save() {
    const productData = [
      this.title,
      this.summary,
      this.price,
      this.description,
      this.image,
      crypto.randomUUID(),
    ]
    await getDb().query('INSERT INTO products (title, summary, price, description, image, id) VALUES (?)', [productData])
  }
}