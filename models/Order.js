const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerInfo: {
      name: String,
      email: String,
      phone: String,
    },
    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        qty: Number,
        price: Number,
        image: String,
        serialNumber: String,
      }
    ],
    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: String,
    totalPrice: { type: Number, required: true },
      // ✅ Thêm dòng này:
    orderId: { type: String, required: true, unique: true },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivered'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
