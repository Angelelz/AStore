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
    fullname;
    address;
    constructor(email, password, fullname, street, postal, city) {
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
        const hasedPassword = await bcryptjs_1.default.hash(this.password, 12);
        const userId = crypto_1.default.randomUUID();
        const [userDb] = await (0, database_1.getDb)().query("INSERT INTO users (name, password, email, id) VALUES (?)", [[this.fullname, hasedPassword, this.email, userId]]);
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
}
exports.User = User;
//# sourceMappingURL=user.model.js.map