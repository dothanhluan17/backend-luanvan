const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Sửa ở đây
    countInStock: { type: Number, default: 0 },
    specs: [
      {
        label: { type: String },
        value: { type: String }
      }
    ]
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;