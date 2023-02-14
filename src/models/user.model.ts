import { getDb } from "../data/database";
import bcrypjs from "bcryptjs";
import crypto from 'crypto'

export class User {
  email: string;
  password: string;
  fullname: string;
  address: {
    street: string;
    postalCode: number;
    city: string;
  };
  constructor(
    email: string,
    password: string,
    fullname: string,
    street: string,
    postal: number,
    city: string
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

  async signup() {
    const hasedPassword = await bcrypjs.hash(this.password, 12);
    const userId = crypto.randomUUID()

    const [userDb]: any = await getDb().query(
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
}
