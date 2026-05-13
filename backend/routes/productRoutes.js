const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
