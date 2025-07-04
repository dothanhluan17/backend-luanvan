const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const statsRoutes = require('./routes/stats');
const returnRoutes = require('./routes/returnRoutes');
const postRoutes = require('./routes/postRoutes');
const { errorHandler } = require('./middleware/errorMiddleware'); // Thêm dòng này
const paymentRoutes = require("./routes/paymentRoutes");
const contactRoutes = require('./routes/contactRoutes');
const chatRoutes = require('./routes/chatRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/posts', postRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/chat', chatRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Middleware xử lý lỗi đặt ở cuối cùng
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});