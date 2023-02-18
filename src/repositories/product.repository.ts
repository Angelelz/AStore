import crypto from "crypto";
import { getDb } from "../data/database";
import { Product } from "../models/products.model";
import { DatabaseProduct, DBProduct, ProductRepository } from "../types";

export const productRepository: ProductRepository = {
  getById: async function (productId: string): Promise<Product> {
    const [product] = await getDb().query<DatabaseProduct[]>(
      "SELECT * FROM products WHERE id = ?",
      [productId]
    );
    if (!product || product.length === 0) {
      const error = new Error("Could not find product with provided id") as any;
      error.code = 404;
      throw error;
    }
    return new Product(product[0]);
  },

  getManyByIds: async function (ids: string[]): Promise<Product[]> {
    if (!ids.length) return [];
    const [products] = await getDb().query<DatabaseProduct[]>(
      "SELECT * FROM products WHERE id IN (?)",
      [ids]
    );
    return products.map((item) => new Product(item));
  },
  getAll: async function (): Promise<Product[]> {
    const [products] = await getDb().query<DatabaseProduct[]>(
      "SELECT * FROM products"
    );

    return products.map((item) => new Product(item));
  },
  saveToDb: async function (product: Product): Promise<void> {
    const productData = [
      product.title,
      product.summary,
      +product.price,
      product.description,
      product.image,
    ];
    if (product.id) {
      if (!product.image) {
        productData.pop();
        productData.push(product.id);
        await getDb().query(
          "UPDATE products SET title = ?, summary = ?, price = ?, description = ? WHERE id = ?",
          productData
        );
        return;
      }
      productData.push(product.id);
      await getDb().query(
        "UPDATE products SET title = ?, summary = ?, price = ?, description = ?, image = ? WHERE id = ?",
        productData
      );
    } else {
      productData.push(crypto.randomUUID());
      await getDb().query(
        "INSERT INTO products (title, summary, price, description, image, id) VALUES (?)",
        [productData]
      );
    }
  },
  removeFromDb: async function (productId?: string): Promise<void> {
    if (!productId) {
      throw new Error("The instance of the class has to have an ID");
    }
    getDb().query("DELETE FROM products WHERE id = ?", [productId]);
  },
};
