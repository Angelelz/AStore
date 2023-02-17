import dotenv from 'dotenv'
dotenv.config()
import { initializeDb } from './data/database';
initializeDb();

import path from 'path';
import express from 'express'
import csurf from 'csurf'
import expressSession from 'express-session'
import authRoutes from './routes/auth.routes'
import baseRoutes from './routes/base.routes'
import productsRoutes from './routes/products.routes'
import adminRoutes from './routes/admin.routes'
import cartRoutes from './routes/cart.routes'
import ordersRoutes from './routes/orders.routes'
import { addCSRFToken } from './middlewares/csrf-token';
import { handleErrors } from './middlewares/error-handler';
import { createSessionConfig } from './data/session-store';
import { checkAuthStatus } from './middlewares/auth-check';
import { protectRoutes } from './middlewares/protect-routes';
import { initializeCart } from './middlewares/cart';
import { updateCartPrices } from './middlewares/update-cart-prices';
import { notFoundHandler } from './middlewares/not-found';

const port = 3000;
const viewsPath = path.join(__dirname, '..', 'views')
const app = express();
app.set('view engine', 'ejs');
app.set('views', viewsPath);

app.use(express.static('public'))
app.use("/products/assets", express.static('product-data'))
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(expressSession(createSessionConfig()))
app.use(csurf());

app.use(initializeCart);
app.use(updateCartPrices);

app.use(addCSRFToken)
app.use(checkAuthStatus)

app.use(baseRoutes)
app.use(authRoutes);
app.use(productsRoutes)
app.use('/cart', cartRoutes)

app.use('/orders', protectRoutes, ordersRoutes)
app.use('/admin', protectRoutes, adminRoutes)

app.use(notFoundHandler)

app.use(handleErrors)

app.listen(port, () => console.log(`Running on port ${port}`))