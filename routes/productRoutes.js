const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  // getProductsByCategoryName
} = require('../controllers/productController');

// Lấy tất cả sản phẩm
router.get('/', getProducts);

// Lấy chi tiết sản phẩm
router.get('/:id', getProductById);

// Thêm sản phẩm mới (chỉ admin)
router.post('/', protect, admin, createProduct);

// Cập nhật sản phẩm (chỉ admin)
router.put('/:id', protect, admin, updateProduct);

// Xóa sản phẩm (chỉ admin)
router.delete('/:id', protect, admin, deleteProduct);


module.exports = router;