const Post = require('../models/Post');

// [GET] /api/posts - Lấy tất cả bài viết
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] /api/posts/:id - Lấy chi tiết bài viết
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [POST] /api/posts - Tạo bài viết mới (admin)
const createPost = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const post = new Post({
      title,
      content,
      image,
      author: {
        _id: req.user._id,
        name: req.user.name,
      },
    });
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// [POST] /api/posts/:id/comments - Bình luận vào bài viết
const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      user: {
        _id: req.user._id,
        name: req.user.name,
      },
      content: req.body.content,
    };

    post.comments.push(comment);
    await post.save();
    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [DELETE] /api/posts/:id - Xóa bài viết
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post không tồn tại' });

    await Post.deleteOne({ _id: req.params.id }); // ✔ Cách xóa đúng
    res.json({ message: 'Post đã bị xoá' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  addComment,
  deletePost
};
