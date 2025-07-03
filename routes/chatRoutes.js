const express = require('express');
const router = express.Router();
const {
  startConversation,
  sendMessage,
  getMessages,
  getAllConversations
} = require('../controllers/chatController');
const { protect, admin } = require('../middleware/authMiddleware');

// Người dùng tạo hoặc lấy cuộc trò chuyện
router.post('/conversation', protect, startConversation);


// Người dùng gửi tin nhắn
router.post('/message', protect, sendMessage);

// Người dùng lấy tin nhắn trong cuộc trò chuyện
router.get('/messages/:id', protect, getMessages);

// Admin lấy tất cả cuộc trò chuyện
router.get('/conversations', protect, admin, getAllConversations);

module.exports = router;
