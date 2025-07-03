const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createPost,
  getPosts,
  getPostById,
  addComment,
  deletePost
} = require('../controllers/postController');

const router = express.Router();

router.route('/').post(protect, admin, createPost).get(getPosts);
router.route('/:id').get(getPostById);
router.route('/:id/comments').post(protect, addComment);
router.route('/:id').get(getPostById).delete(protect, admin, deletePost);

module.exports = router; // ✅ Dùng CommonJS export
