const Product = require("../models/productModel");

// add new product
const addProduct = async (productData) => {
  const product = new Product(productData);
  const result = await product.save();
  return result;
};

// Get a product by ID
const getProductById = async (productId) => {
  const singleProduct = await Product.findById(productId);
  return singleProduct;
};

// get all products
const getAllProducts = async () => {
  const allProducts = await Product.find();
  return {
    totalCount: allProducts.length,
    products: allProducts,
  };
};

// Update a product by ID
const updateProduct = async (productId, updateData) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    { new: true }
  );
  return updatedProduct;
};

// Delete a product by ID
const deleteProduct = async (productId) => {
  const deletedProduct = await Product.findByIdAndDelete(productId);
  return deletedProduct;
};

module.exports = {
  addProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
