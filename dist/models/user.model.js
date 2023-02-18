"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_repository_1 = require("../repositories/user.repository");
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
        return await user_repository_1.userRepository.getUserByEmail(this.email);
    }
    static async getById(id) {
        return await user_repository_1.userRepository.getById(id);
    }
    static async getFullUserById(id) {
        return await user_repository_1.userRepository.getFullUserById(id);
    }
    userExists() {
        return user_repository_1.userRepository.emailExists(this.email);
    }
    async signup() {
        user_repository_1.userRepository.addToDb(this);
    }
    passwordMatch(hashedPassword) {
        return bcryptjs_1.default.compare(this.password, hashedPassword);
    }
}
exports.User = User;
//# sourceMappingURL=user.model.js.map