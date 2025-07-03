const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getReviewsByProduct,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');

// Lấy tất cả review của 1 sản phẩm
router.get('/product/:productId', getReviewsByProduct);

// Thêm review mới
router.post('/', protect, createReview);

// Xóa review
router.delete('/:id', protect, deleteReview);

module.exports = router;