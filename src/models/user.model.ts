import bcrypjs from "bcryptjs";
import { userRepository } from "../repositories/user.repository";

export class User {
  email: string;
  password: string;
  name?: string;
  id?: string;
  address: {
    street?: string;
    postalCode?: number;
    city?: string;
  };
  constructor(
    email: string,
    password: string,
    fullname?: string,
    street?: string,
    postal?: number,
    city?: string,
    id?: string
  ) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.id = id;
    this.address = {
      street,
      postalCode: postal,
      city,
    };
  }

  async getUserByEmail() {
    return await userRepository.getUserByEmail(this.email);
  }

  static async getById(id: string) {
    return await userRepository.getById(id);
  }

  static async getFullUserById(id: string) {
    return await userRepository.getFullUserById(id);
  }

  userExists() {
    return userRepository.emailExists(this.email);
  }

  async signup() {
    userRepository.addToDb(this);
  }
  passwordMatch(hashedPassword: string) {
    return bcrypjs.compare(this.password, hashedPassword);
  }
}
