"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./data/database");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
(0, database_1.initializeDb)();
dotenv_1.default.config();
const port = 3000;
const viewsPath = path_1.default.join(__dirname, 'views');
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.use(express_1.default.static('public'));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(auth_routes_1.default);
app.listen(port, () => console.log(`Running on port ${port}`));
//# sourceMappingURL=app.js.map