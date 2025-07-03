// controllers/statsController.js
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');


const getRevenueByMonth = async (req, res) => {
  try {
    const revenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$totalPrice' },
        },
      },
      {
        $project: {
          month: '$_id',
          total: 1,
          _id: 0
        },
      },
      { $sort: { month: 1 } }
    ]);

    res.json(revenue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getOverviewStats = async (req, res) => {
  try {
    const [totalRevenueResult, totalOrders, totalUsers, totalProducts] = await Promise.all([
      Order.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments()
    ]);

    res.json({
      totalRevenue: totalRevenueResult[0]?.total || 0,
      totalOrders,
      totalUsers,
      totalProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRevenueByMonth,
  getOverviewStats
};
