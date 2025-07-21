const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  getOrderByOrderId,
  cancelOrder
} = require('../controllers/orderController');

// Tạo đơn hàng mới
router.post('/', protect,createOrder);

// Lấy đơn hàng của user hiện tại
router.get('/myorders', protect, getMyOrders);

// Lấy chi tiết đơn hàng
router.get('/:id', protect, getOrderById);

// Lấy tất cả đơn hàng (admin)
router.get('/', protect, admin, getOrders);

router.put('/:id/status', protect, admin, updateOrderStatus);

router.get('/orderid/:orderId', getOrderByOrderId);

router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;