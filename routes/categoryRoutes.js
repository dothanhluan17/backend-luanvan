const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// Lấy tất cả danh mục
router.get('/', getCategories);

// Lấy chi tiết danh mục
router.get('/:id', getCategoryById);

// Thêm danh mục mới (chỉ admin)
router.post('/', protect, admin, createCategory);

// Cập nhật danh mục (chỉ admin)
router.put('/:id', protect, admin, updateCategory);

// Xóa danh mục (chỉ admin)
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;