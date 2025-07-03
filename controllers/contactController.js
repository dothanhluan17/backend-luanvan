const Contact = require('../models/Contact');

// Gửi tin nhắn liên hệ từ khách hàng
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ message: 'Tin nhắn đã được gửi thành công.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh sách tin nhắn liên hệ (dành cho admin)
const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendContactMessage,
  getAllMessages,
};
