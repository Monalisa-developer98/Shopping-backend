const cartService = require("../services/cartService");

// add to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userData._id;
    const cart = await cartService.addToCart(userId, productId, quantity);
    res.status(200).json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// view cart
const viewCart = async (req, res) => {
    try {
      const userId = req.userData._id;
      const cart = await cartService.viewCart(userId);
      res.status(200).json({ success: true, cart });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

// remove from cart
const removeFromCart = async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.userData._id;
  
      const cart = await cartService.removeFromCart(userId, productId);
      res.status(200).json({ success: true, message: "Item removed from cart", cart });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };


module.exports = { 
    addToCart,
    viewCart,
    removeFromCart
};