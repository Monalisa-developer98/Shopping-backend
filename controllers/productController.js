const Responses = require("../helpers/response");
const productService = require("../services/productService");
const messages = require("../constants/constMessages");

// add product
const addProduct = async (req, res) => {
  try {
    const result = await productService.addProduct(req.body);
    return Responses.successResponse(
      req,
      res,
      result,
      messages.productAdded,
      201
    );
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};

// getproduct by id
const getProductById = async (req, res) => {
  try {
    const result = await productService.getProductById(req.params.id);
    if (!result) {
      return Responses.failResponse(
        req,
        res,
        null,
        messages.productNotFound,
        200
      );
    }
    return Responses.successResponse(
      req,
      res,
      result,
      messages.productsFetched,
      200
    );
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};

// get all products
const getAllProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts();
    return Responses.successResponse(
      req,
      res,
      result,
      messages.productsFetched,
      200
    );
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const result = await productService.updateProduct(req.params.id, req.body);
    if (!result) {
      return Responses.failResponse(
        req,
        res,
        null,
        messages.productNotFound,
        200
      );
    }
    return Responses.successResponse(
      req,
      res,
      result,
      messages.updatedSuccess,
      200
    );
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    if (!result) {
      return Responses.failResponse(
        req,
        res,
        null,
        messages.productNotFound,
        200
      );
    }
    return Responses.successResponse(
      req,
      res,
      result,
      messages.deletedSuccess,
      200
    );
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};

module.exports = {
  addProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
