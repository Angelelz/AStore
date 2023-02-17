"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.initializeDb = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
let pool;
const initializeDb = () => {
    pool = promise_1.default.createPool({
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: +process.env.DATABASE_PORT,
        debug: true,
    });
    // pool.on('connection', (conn) => {
    //   console.log("Connection", conn)
    //   // conn.on('end', (seq) => console.log("Sequence", seq))
    // })
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

  CREATE TABLE IF NOT EXISTS `sessions` (
    `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
    `expires` int(11) unsigned NOT NULL,
    `data` mediumtext COLLATE utf8mb4_bin,
    PRIMARY KEY (`session_id`)
  ) ENGINE=InnoDB

  ALTER TABLE `astore`.`users`
  ADD COLUMN `isAdmin` TINYINT NOT NULL DEFAULT 0 AFTER `password`;

  CREATE TABLE `astore`.`products` (
    `id` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `summary` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `description` TEXT NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
    PRIMARY KEY (`id`));

    ========================================
    Created manually
  
  CREATE TABLE `astore`.`carts` (
    `id` VARCHAR(255) NOT NULL,
    `totalQuantity` INT NOT NULL,
    `totalPrice` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);

  CREATE TABLE `astore`.`cartItems` (
    `id` VARCHAR(255) NOT NULL,
    `quantity` INT NOT NULL,
    `totalPrice` DECIMAL(10,2) NOT NULL,
    `productId` VARCHAR(255) NOT NULL,
    `cartId` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `productId_idx` (`productId` ASC) VISIBLE,
  INDEX `cartId_idx` (`cartId` ASC) VISIBLE,
  CONSTRAINT `productId`
    FOREIGN KEY (`productId`)
    REFERENCES `astore`.`products` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `cartId`
    FOREIGN KEY (`cartId`)
    REFERENCES `astore`.`carts` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);

  CREATE TABLE `astore`.`orders` (
    `id` VARCHAR(255) NOT NULL,
    `date` DATETIME NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `userId` VARCHAR(255) NOT NULL,
    `cartId` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `userId_idx` (`userId` ASC) VISIBLE,
  CONSTRAINT `orderUserId`
    FOREIGN KEY (`userId`)
    REFERENCES `astore`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  INDEX `cartId_idx` (`cartId` ASC) VISIBLE,
  CONSTRAINT `orderCartId`
    FOREIGN KEY (`cartId`)
    REFERENCES `astore`.`carts` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION);

*/
//# sourceMappingURL=database.js.map