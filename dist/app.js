"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database_1 = require("./data/database");
(0, database_1.initializeDb)();
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const csurf_1 = __importDefault(require("csurf"));
const express_session_1 = __importDefault(require("express-session"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const base_routes_1 = __importDefault(require("./routes/base.routes"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const csrf_token_1 = require("./middlewares/csrf-token");
const error_handler_1 = require("./middlewares/error-handler");
const session_store_1 = require("./data/session-store");
const auth_check_1 = require("./middlewares/auth-check");
const protect_routes_1 = require("./middlewares/protect-routes");
const cart_1 = require("./middlewares/cart");
const update_cart_prices_1 = require("./middlewares/update-cart-prices");
const not_found_1 = require("./middlewares/not-found");
const port = 3000;
const viewsPath = path_1.default.join(__dirname, "..", "views");
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", viewsPath);
app.use(express_1.default.static("public"));
app.use("/products/assets", express_1.default.static("product-data"));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, express_session_1.default)((0, session_store_1.createSessionConfig)()));
app.use((0, csurf_1.default)());
app.use(cart_1.initializeCart);
app.use(update_cart_prices_1.updateCartPrices);
app.use(csrf_token_1.addCSRFToken);
app.use(auth_check_1.checkAuthStatus);
app.use(base_routes_1.default);
app.use(auth_routes_1.default);
app.use(products_routes_1.default);
app.use("/cart", cart_routes_1.default);
app.use("/orders", protect_routes_1.protectRoutes, orders_routes_1.default);
app.use("/admin", protect_routes_1.protectRoutes, admin_routes_1.default);
app.use(not_found_1.notFoundHandler);
app.use(error_handler_1.handleErrors);
app.listen(port, () => console.log(`Running on port ${port}`));
//# sourceMappingURL=app.js.map