import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { getDb } from "../data/database";
import { User } from "../models/user.model";
import { DatabaseUser, DBUser, UserRepository } from "../types";

export const userRepository: UserRepository = {
  getUserByEmail: async function (email: string): Promise<DatabaseUser> {
    const [dbUser] = await getDb().query<DatabaseUser[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return dbUser[0];
  },
  getById: async function (userId: string): Promise<DBUser> {
    const [dbUser] = await getDb().query<DBUser[]>(
      "SELECT id, email, name, isAdmin FROM users WHERE id = ?",
      [userId]
    );
    return dbUser[0];
  },
  getFullUserById: async function (userId: string): Promise<User> {
    const dbUser = await getDb().query<any>({
      sql: "SELECT * FROM users LEFT JOIN addresses ON addresses.userId = users.id WHERE users.id = ?",
      values: [userId],
    });

    return new User(
      dbUser[0][0].email,
      "-",
      dbUser[0][0].name,
      dbUser[0][0].street,
      dbUser[0][0].postalCode,
      dbUser[0][0].city,
      dbUser[0][0].userId
    );
  },
  addToDb: async function (user: User): Promise<void> {
    const userId = crypto.randomUUID();
    const hasedPassword = await bcryptjs.hash(user.password, 12);
    await getDb().query(
      "INSERT INTO users (name, password, email, id) VALUES (?)",
      [[user.name, hasedPassword, user.email, userId]]
    );

    await getDb().query(
      "INSERT INTO addresses (street, postalCode, city, id, userId) VALUES (?)",
      [
        [
          user.address.street,
          user.address.postalCode,
          user.address.city,
          crypto.randomUUID(),
          userId,
        ],
      ]
    );
  },
  emailExists: async function (email: string): Promise<boolean> {
    return (
      (
        await getDb().query<DBUser[]>("SELECT * FROM users WHERE email = ?", [
          email,
        ])
      )[0].length > 0
    );
  },
};
