const express = require('express');
const router = express.Router();
const {
  createReturnRequest,
  getAllReturnRequests,
  updateReturnStatus,
  getMyReturnRequests
} = require('../controllers/returnController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createReturnRequest); // Khách hàng gửi yêu cầu
router.get('/', protect, admin, getAllReturnRequests); // Admin xem tất cả
router.put('/:id', protect, admin, updateReturnStatus); // Admin xử lý yêu cầu
router.get('/my', protect, getMyReturnRequests); //trang thai don hang cua khach hang

module.exports = router;




