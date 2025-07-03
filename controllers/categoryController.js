const Category = require('../models/Category');

// [GET] /api/categories - Lấy tất cả danh mục
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [GET] /api/categories/:id - Lấy chi tiết danh mục
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [POST] /api/categories - Thêm danh mục mới (admin)
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PUT] /api/categories/:id - Cập nhật danh mục (admin)
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = name || category.name;
      category.description = description || category.description;
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [DELETE] /api/categories/:id - Xóa danh mục (admin)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await Category.deleteOne({ _id: req.params.id }); // Sửa dòng này
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // [GET] /api/products/category/:categoryName - Lấy sản phẩm theo tên danh mục
// const getProductsByCategoryName = async (req, res) => {
//   try {
//     const { categoryName } = req.params;
//     const category = await Category.findOne({ name: categoryName });

//     if (!category) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     const products = await Product.find({ category: category._id });
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};