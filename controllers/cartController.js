const Cart = require('../models/Cart');

// [GET] /api/cart - Lấy giỏ hàng của user
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [POST] /api/cart - Thêm hoặc cập nhật sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [{ product: productId, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// [DELETE] /api/cart/:productId - Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PUT] /api/cart - Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Product not in cart' });

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getCart, 
  addToCart, 
  removeFromCart, 
  updateCartItem 
};

// const Cart = require('../models/Cart');

// // [GET] /api/cart - Lấy giỏ hàng của user
// const getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
//     res.json(cart || { items: [] });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // [POST] /api/cart - Thêm hoặc cập nhật sản phẩm vào giỏ hàng
// const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     let cart = await Cart.findOne({ user: req.user.id });

//     if (!cart) {
//       cart = new Cart({
//         user: req.user.id,
//         items: [{ product: productId, quantity }]
//       });
//     } else {
//       const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
//       if (itemIndex > -1) {
//         cart.items[itemIndex].quantity += quantity;
//       } else {
//         cart.items.push({ product: productId, quantity });
//       }
//     }

//     await cart.save();
//     const updatedCart = await Cart.findById(cart._id).populate('items.product');
//     res.json(updatedCart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // [DELETE] /api/cart/:productId - Xóa sản phẩm khỏi giỏ hàng
// const removeFromCart = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const cart = await Cart.findOne({ user: req.user.id });
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     cart.items = cart.items.filter(item => item.product.toString() !== productId);
//     await cart.save();

//     const updatedCart = await Cart.findById(cart._id).populate('items.product');
//     res.json(updatedCart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // [PUT] /api/cart - Cập nhật số lượng sản phẩm trong giỏ hàng
// const updateCartItem = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     const cart = await Cart.findOne({ user: req.user.id });
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     const item = cart.items.find(item => item.product.toString() === productId);
//     if (!item) return res.status(404).json({ message: 'Product not in cart' });

//     item.quantity = quantity;
//     await cart.save();

//     const updatedCart = await Cart.findById(cart._id).populate('items.product');
//     res.json(updatedCart);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getCart,
//   addToCart,
//   removeFromCart,
//   updateCartItem
// };
