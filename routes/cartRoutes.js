const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controllers/cartController');

// Lấy giỏ hàng của user
router.get('/', protect, getCart);

// Thêm hoặc cập nhật sản phẩm vào giỏ hàng
router.post('/', protect, addToCart);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/:productId', protect, removeFromCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/', protect, updateCartItem);

module.exports = router;