import express from 'express';
import { configuredMulterMiddleware } from '../middlewares/image-upload';
import { createNewProduct, deleteProductPost, deleteProductDelete, getNewProduct, getProducts, getUpdateProduct, updateProduct } from '../controllers/admin.controller';

const router = express.Router();

router.get('/products', getProducts)
router.get('/products/new', getNewProduct)
router.post('/products', configuredMulterMiddleware, createNewProduct)
router.get('/products/:id', getUpdateProduct)
router.post('/products/:id', configuredMulterMiddleware, updateProduct)
router.post('/products/delete/:id', deleteProductPost)
router.delete('/products/:id', deleteProductDelete)


export default router;