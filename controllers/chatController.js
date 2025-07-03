const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const startConversation = async (req, res) => {
  const userId = req.user._id;
  try {
    let conversation = await Conversation.findOne({ user: userId });
    if (!conversation) {
      conversation = new Conversation({ user: userId });
      await conversation.save();
    }
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo cuộc trò chuyện' });
  }
};

const sendMessage = async (req, res) => {
  const { conversationId, text } = req.body;
  try {
    const message = new Message({
      conversation: conversationId,
      sender: req.user._id,
      text,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi gửi tin nhắn' });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'name email isAdmin');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Không lấy được tin nhắn' });
  }
};

const getAllConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate('user', 'name email');
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Không lấy được danh sách cuộc trò chuyện' });
  }
};

module.exports = {
  startConversation,
  sendMessage,
  getMessages,
  getAllConversations,
};
