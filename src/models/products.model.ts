import { getDb } from "../data/database";
import crypto from 'crypto'
import { DBProduct, DBUser } from "../types";

export class Product {
  title: string;
  summary: string;
  price: number;
  description: string;
  image: string;
  imagePath!: string;
  imageUrl!: string;
  id?: string;

  constructor(productData: DBProduct) {
    this.title = productData.title
    this.summary = productData.summary
    this.price = +productData.price
    this.description = productData.description
    this.image = productData.image
    this.updateImageData()
    this.id = productData.id
  }

  static async getById(productId: string) {
    const [product] = await getDb().query<DBProduct[]>("SELECT * FROM products WHERE id = ?", [productId])
    if (!product || product.length === 0) {
      const error = new Error("Could not find product with provided id") as any;
      error.code = 404;
      throw error
    }
    return new Product(product[0])
  }

  static async getAll() {
    const [products] = await getDb().query<DBProduct[]>("SELECT * FROM products")

    return products.map((item) => {
      return new Product(item);
    });
  }

  static async findMultiple(ids: string[]) {

    return await Promise.all(ids.map(id => {
      return Product.getById(id)
    }))
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    const productData = [
      this.title,
      this.summary,
      this.price,
      this.description,
      this.image,
    ]
    if (this.id) {
      if (!this.image) {
        productData.pop()
        productData.push(this.id)
        await getDb().query('UPDATE products SET title = ?, summary = ?, price = ?, description = ? WHERE id = ?', productData)
        return;
      }
      productData.push(this.id)
      await getDb().query('UPDATE products SET title = ?, summary = ?, price = ?, description = ?, image = ? WHERE id = ?', productData)
    } else {
      productData.push(crypto.randomUUID())
      await getDb().query('INSERT INTO products (title, summary, price, description, image, id) VALUES (?)', [productData])
    }
  }

  async replaceImage(newImage: string) {
    this.image = newImage;
    this.updateImageData()
  }

  remove() {
    if (!this.id) {
      throw new Error("The instance of the class has to have an ID")
    }
    return getDb().query('DELETE FROM products WHERE id = ?', [this.id])
  }
}