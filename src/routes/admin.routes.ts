import express from 'express';
import { configuredMulterMiddleware } from '../middlewares/image-upload';
import { createNewProduct, getNewProduct, getProducts } from '../controllers/admin.controller';

const router = express.Router();

router.get('/products', getProducts)
router.get('/products/new', getNewProduct)
router.post('/products', configuredMulterMiddleware, createNewProduct)

export default router;