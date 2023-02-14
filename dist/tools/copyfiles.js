"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
fs_1.default.cpSync(path_1.default.join(__dirname, '..', '..', 'src', "views"), path_1.default.join(__dirname, '..', '..', 'dist', 'views'), { recursive: true });
//# sourceMappingURL=copyfiles.js.map