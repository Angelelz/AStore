import { getDb } from "../data/database";
import bcrypjs from "bcryptjs";
import crypto from 'crypto'
import { DBUser } from "../types";
import { RowDataPacket } from "mysql2";

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
    const [dbUser] = await getDb().query<DBUser[]>('SELECT * FROM users WHERE email = ?', [this.email]);
    return dbUser[0]
  }

  static async getById(id: string) {
    const [dbUser] = await getDb().query<DBUser[]>('SELECT email, name, id FROM users WHERE id = ?', [id])
    return dbUser[0];
  }

  static async getAddressByUserId(userId: string) {
    const [address] = await getDb().query<RowDataPacket[]>('SELECT * FROM addresses WHERE userId = ?', [userId]);
    return {
      street: address[0].street,
      postal: +address[0].postal,
      city: address[0].city,
      id: address[0].id,
    }
  }

  static async getFullUserById(id: string) {
    const DBUser = await User.getById(id);
    const address = await User.getAddressByUserId(id);
    return new User(DBUser.email, "-", DBUser.name, address.street, address.postal, address.city, DBUser.id);
  }

  async userExists() {
    const user = await this.getUserByEmail();
    return !!user
  }

  async signup() {
    const hasedPassword = await bcrypjs.hash(this.password, 12);
    const userId = crypto.randomUUID()

    await getDb().query(
      "INSERT INTO users (name, password, email, id) VALUES (?)",
      [[this.name, hasedPassword, this.email, userId]]
    );

    await getDb().query(
      "INSERT INTO addresses (street, postalCode, city, id, userId) VALUES (?)",
      [
        [
          this.address.street,
          this.address.postalCode,
          this.address.city,
          crypto.randomUUID(),
          userId,
        ],
      ]
    );
  }
  passwordMatch(hashedPassword: string) {
    return bcrypjs.compare(this.password, hashedPassword);
  }

}
