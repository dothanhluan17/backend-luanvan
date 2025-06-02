const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Đăng ký & Đăng nhập
router.post('/register', createUser);
router.post('/login', loginUser);

// Thông tin cá nhân
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
