const express = require('express');
const router = express.Router();
const {
  sendContactMessage,
  getAllMessages
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware'); // 👈 Đường dẫn có thể cần điều chỉnh tùy bạn

// Người dùng gửi tin nhắn
router.post('/', sendContactMessage);

// Admin xem tất cả tin nhắn liên hệ
router.get('/admin', protect, admin, getAllMessages); // 🔒 Bảo vệ bằng token và quyền admin

module.exports = router;
