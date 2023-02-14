import express from 'express';

const router = express.Router();

router.get('/products', (req, res) => {
  res.render('customer/products/all-products')
})

export default router;