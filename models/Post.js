const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: String,
  createdAt: { type: Date, default: Date.now },
  author: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
  },
  comments: [commentSchema],
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post; 
