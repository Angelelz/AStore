"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_1 = require("../data/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
class User {
    email;
    password;
    name;
    id;
    address;
    constructor(email, password, fullname, street, postal, city, id) {
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
        const [dbUser] = await (0, database_1.getDb)().query('SELECT * FROM users WHERE email = ?', [this.email]);
        return dbUser[0];
    }
    static async getById(id) {
        const [dbUser] = await (0, database_1.getDb)().query('SELECT email, name, id FROM users WHERE id = ?', [id]);
        return dbUser[0];
    }
    static async getAddressByUserId(userId) {
        const [address] = await (0, database_1.getDb)().query('SELECT * FROM addresses WHERE userId = ?', [userId]);
        return {
            street: address[0].street,
            postal: +address[0].postal,
            city: address[0].city,
            id: address[0].id,
        };
    }
    static async getFullUserById(id) {
        const DBUser = await User.getById(id);
        const address = await User.getAddressByUserId(id);
        return new User(DBUser.email, "-", DBUser.name, address.street, address.postal, address.city, DBUser.id);
    }
    async userExists() {
        const user = await this.getUserByEmail();
        return !!user;
    }
    async signup() {
        const hasedPassword = await bcryptjs_1.default.hash(this.password, 12);
        const userId = crypto_1.default.randomUUID();
        await (0, database_1.getDb)().query("INSERT INTO users (name, password, email, id) VALUES (?)", [[this.name, hasedPassword, this.email, userId]]);
        await (0, database_1.getDb)().query("INSERT INTO addresses (street, postalCode, city, id, userId) VALUES (?)", [
            [
                this.address.street,
                this.address.postalCode,
                this.address.city,
                crypto_1.default.randomUUID(),
                userId,
            ],
        ]);
    }
    passwordMatch(hashedPassword) {
        return bcryptjs_1.default.compare(this.password, hashedPassword);
    }
}
exports.User = User;
//# sourceMappingURL=user.model.js.map