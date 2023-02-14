import { getDb } from "../data/database";
import bcrypjs from "bcryptjs";
import crypto from 'crypto'
import { DBUser } from "../types";

export class User {
  email: string;
  password: string;
  fullname?: string;
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
    city?: string
  ) {
    this.email = email;
    this.password = password;
    this.fullname = fullname;
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

  async userExists() {
    const user = await this.getUserByEmail();
    return !!user
  }

  async signup() {
    const hasedPassword = await bcrypjs.hash(this.password, 12);
    const userId = crypto.randomUUID()

    await getDb().query(
      "INSERT INTO users (name, password, email, id) VALUES (?)",
      [[this.fullname, hasedPassword, this.email, userId]]
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
