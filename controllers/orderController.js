const Order = require('../models/Order');

// [POST] /api/orders - Tạo đơn hàng mới
// const createOrder = async (req, res) => {
//   try {
//     const { orderItems, shippingAddress, paymentMethod, totalPrice, customerInfo  } = req.body;
//     if (!orderItems || orderItems.length === 0) {
//       return res.status(400).json({ message: 'No order items' });
//     }
//      const orderId = 'order_' + Date.now();
//     const order = new Order({
//       user: req.user.id, // Bỏ dòng này  nếu có đăng nhập thì lưu
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       totalPrice,
//       customerInfo, // Thêm trường này nếu muốn lưu thông tin khách lẻ
//       orderId // Thêm trường này
//     });
//     const createdOrder = await order.save();
//     res.status(201).json(createdOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const Product = require('../models/Product'); // ✅ thêm import

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice, customerInfo } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const orderId = 'order_' + Date.now();

    // ✅ Gắn serialNumber cho mỗi item từ Product DB
    const itemsWithSerial = await Promise.all(orderItems.map(async (item) => {
      const product = await Product.findById(item.product);
      return {
        ...item,
        serialNumber: product?.serialNumber || 'N/A',
      };
    }));

    const order = new Order({
      user: req.user?.id, // Bỏ nếu không có đăng nhập
      orderItems: itemsWithSerial, // ✅ dùng danh sách đã gắn serial
      shippingAddress,
      paymentMethod,
      totalPrice,
      customerInfo,
      orderId
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: error.message });
  }
};


// [GET] /api/orders/myorders - Lấy đơn hàng của user hiện tại
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] /api/orders/:id - Lấy chi tiết đơn hàng
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name'); 
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] /api/orders - Lấy tất cả đơn hàng (admin)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
    .populate('user', 'name email')
    .populate('orderItems.product', 'name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      // ✅ Nếu đơn chưa thanh toán (COD), cập nhật là đã thanh toán
      if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentMethod = order.paymentMethod || 'COD'; // đảm bảo có phương thức
      }
    }

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET /api/orders/orderid/:orderId
const getOrderByOrderId = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//huy don hang
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Chỉ cho phép hủy nếu đơn chưa giao
    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Đơn hàng đã giao không thể hủy' });
    }

    // Đảm bảo chỉ user của đơn đó mới được hủy
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền hủy đơn này' });
    }

    order.status = 'cancelled';
    const cancelledOrder = await order.save();

    res.json({ message: 'Đơn hàng đã được hủy', order: cancelledOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  getOrderByOrderId,
  cancelOrder
};