const Product = require('../models/Product');

// [GET] /api/products - Lấy tất cả sản phẩm
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) { 
    res.status(500).json({ message: error.message });
  }
};

// [GET] /api/products/:id - Lấy chi tiết sản phẩm
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [POST] /api/products - Thêm sản phẩm mới (admin)
const createProduct = async (req, res) => {
  try {
    const { name, serialNumber,price, description, image, category, countInStock, specs } = req.body;

    const product = new Product({
      name,
      serialNumber,
      price,
      description,
      image,
      category,
      countInStock,
      specs, 
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PUT] /api/products/:id - Cập nhật sản phẩm (admin)
const updateProduct = async (req, res) => {
  try {
    const { name, serialNumber,price, description, image, category, countInStock, specs } = req.body;

    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
       product.serialNumber = serialNumber || product.serialNumber;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;
      product.specs = specs || product.specs; // Cập nhật specs

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [DELETE] /api/products/:id - Xóa sản phẩm (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
