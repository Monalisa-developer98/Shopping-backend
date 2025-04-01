const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const addToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    return {
      productNotFound: true,
    };
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [], totalAmount: 0 });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.price = product.price;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  cart.totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();
  return cart;
};

//get cart
const viewCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("items.product");
};

//remove from cart
const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );
  cart.totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();
  return cart;
};

module.exports = {
  addToCart,
  viewCart,
  removeFromCart,
};
