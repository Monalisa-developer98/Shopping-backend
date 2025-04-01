const Joi = require("joi");
const Responses = require("../helpers/response");

const addProductValidator = async (req, res, next) => {
  try {
    const headerSchema = Joi.object({
      headers: Joi.object({
        authorization: Joi.required(),
      }).unknown(true),
    });
    const bodySchema = Joi.object({
      productName: Joi.string().trim().min(2).max(100).required(),
      price: Joi.number().min(0).required(),
      category: Joi.string().trim().min(2).max(50).required(),
      description: Joi.string().trim().max(500).optional(),
      stock: Joi.number().min(0).required(),
      imageUrl: Joi.string().required(),
    });
    await headerSchema.validateAsync({ headers: req.headers });
    await bodySchema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error, 200);
  }
};

const getProductByIdValidator = async (req, res, next) => {
  try {
    const headerSchema = Joi.object({
      headers: Joi.object({
        authorization: Joi.required(),
      }).unknown(true),
    });
    const paramsSchema  = Joi.object({
      id: Joi.string().trim().alphanum().required(),
    });
    await headerSchema.validateAsync({ headers: req.headers });
    await paramsSchema .validateAsync(req.params);
    next();
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error, 200);
  }
};

const allProductsValidator = async (req, res, next) => {
  try {
    const headerSchema = Joi.object({
      headers: Joi.object({
        authorization: Joi.required(),
      }).unknown(true),
    });
    await headerSchema.validateAsync({ headers: req.headers });
    next();
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error, 200);
  }
};

const updateProductValidator = async (req, res, next) => {
  try {
    const headerSchema = Joi.object({
      headers: Joi.object({
        authorization: Joi.required(),
      }).unknown(true),
    });
    const paramsSchema = Joi.object({
      id: Joi.string().trim().required().messages({
        "any.required": "Product ID is required",
      }),
    });
    const bodySchema = Joi.object({
      productName: Joi.string().trim().min(2).max(100).required(),
      price: Joi.number().min(0).required(),
      category: Joi.string().trim().min(2).max(50).required(),
      description: Joi.string().trim().max(500).optional(),
      stock: Joi.number().min(0).required(),
      imageUrl: Joi.string()
    });
    await headerSchema.validateAsync({ headers: req.headers });
    await paramsSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error, 200);
  }
};


const deleteProductValidator = async (req, res, next) => {
  try {
    const headerSchema = Joi.object({
      headers: Joi.object({
        authorization: Joi.required(),
      }).unknown(true),
    });
    const paramsSchema = Joi.object({
      id: Joi.string().trim().alphanum().required(),
    });
    await headerSchema.validateAsync({ headers: req.headers });
    await paramsSchema.validateAsync(req.params);
    next();
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error, 200);
  }
};


module.exports = {
  addProductValidator,
  getProductByIdValidator,
  allProductsValidator,
  updateProductValidator,
  deleteProductValidator
};
