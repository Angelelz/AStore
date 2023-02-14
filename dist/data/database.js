"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.initializeDb = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
let pool;
const initializeDb = () => {
    console.log({
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: +process.env.DATABASE_PORT,
    });
    pool = promise_1.default.createPool({
        host: 'backend.angelelz.com',
        database: "astore",
        user: "angel",
        password: "Angelito",
        port: 3306,
    });
};
exports.initializeDb = initializeDb;
const getDb = () => {
    if (typeof pool === "undefined") {
        throw new Error("Database not initialized");
    }
    return pool;
};
exports.getDb = getDb;
/*
  CREATE DATABASE IF NOT EXISTS astore;
  USE astore;

  CREATE TABLE `astore`.`users` (
  `id` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);

  CREATE TABLE `astore`.`addresses` (
  `id` VARCHAR(255) NOT NULL,
  `street` VARCHAR(255) NOT NULL,
  `city` VARCHAR(255) NOT NULL,
  `postalCode` INT NOT NULL,
  `userId` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `userId_idx` (`userId` ASC) VISIBLE,
  CONSTRAINT `userId`
    FOREIGN KEY (`userId`)
    REFERENCES `astore`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);



*/
//# sourceMappingURL=database.js.map