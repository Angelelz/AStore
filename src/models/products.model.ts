import { DBProduct } from "../types";
import { productRepository } from "../repositories/product.repository";

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
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image;
    this.updateImageData();
    this.id = productData.id;
  }

  static getById(productId: string) {
    return productRepository.getById(productId);
  }

  static getAll() {
    return productRepository.getAll();
  }

  static async getMultiple(ids: string[]) {
    return await productRepository.getManyByIds(ids);
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    productRepository.saveToDb(this);
  }

  async replaceImage(newImage: string) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    return productRepository.removeFromDb(this.id);
  }
}
