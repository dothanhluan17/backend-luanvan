const Review = require('../models/Review');

// [GET] /api/reviews/product/:productId - Lấy tất cả review của 1 sản phẩm
const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [POST] /api/reviews - Thêm review mới (user)
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    // Kiểm tra user đã review sản phẩm này chưa
    const alreadyReviewed = await Review.findOne({ user: req.user.id, product: productId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    const review = new Review({
      user: req.user.id,
      product: productId,
      rating,
      comment,
    });
    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [DELETE] /api/reviews/:id - Xóa review (user hoặc admin)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    // Chỉ cho phép xóa nếu là chủ review hoặc admin
    if (review.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.remove();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviewsByProduct,
  createReview,
  deleteReview,
};