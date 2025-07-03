const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');

// Tạo yêu cầu hoàn hàng
const createReturnRequest = async (req, res) => {
  try {
    const { orderId, productId, reason } = req.body;

    // Kiểm tra tồn tại đơn hàng
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });

    // Kiểm tra đơn đã giao và trong 7 ngày
    const isDelivered = order.status === 'delivered';
    const within7Days = new Date() - new Date(order.deliveredAt) <= 7 * 24 * 60 * 60 * 1000;

    if (!isDelivered || !within7Days) {
      return res.status(400).json({ message: 'Đơn hàng không đủ điều kiện hoàn hàng' });
    }

    // Kiểm tra sản phẩm có trong đơn hàng không
    const productInOrder = order.orderItems.find((item) => item.product.toString() === productId);
    if (!productInOrder) {
      return res.status(400).json({ message: 'Sản phẩm không nằm trong đơn hàng' });
    }

    // Kiểm tra đã gửi yêu cầu hoàn sản phẩm này chưa
    const existing = await ReturnRequest.findOne({
      order: orderId,
      product: productId,
      user: req.user.id,
    });
    if (existing) {
      return res.status(400).json({ message: 'Bạn đã gửi yêu cầu cho sản phẩm này' });
    }

    // Lưu yêu cầu hoàn hàng
    const request = new ReturnRequest({
      order: orderId,
      product: productId,
      user: req.user.id,
      reason,
    });

    await request.save();
    res.status(201).json({ message: '✅ Gửi yêu cầu hoàn hàng thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin xem tất cả yêu cầu
const getAllReturnRequests = async (req, res) => {
  try {
    const requests = await ReturnRequest.find()
      .populate('order')
      .populate('product') // 👈 Thêm để hiển thị rõ sản phẩm nào
      .populate('user', 'name email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin cập nhật trạng thái
const updateReturnStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ReturnRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Yêu cầu không tồn tại' });

    request.status = status;
    await request.save();

    res.json({ message: `Yêu cầu đã được ${status === 'approved' ? 'phê duyệt' : 'từ chối'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Người dùng xem yêu cầu của mình
const getMyReturnRequests = async (req, res) => {
  try {
    const requests = await ReturnRequest.find({ user: req.user.id })
      .populate('order')
      .populate('product');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createReturnRequest,
  getAllReturnRequests,
  updateReturnStatus,
  getMyReturnRequests,
};
