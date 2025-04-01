const Joi = require("joi");
const Responses = require("../helpers/response");

const userRegisterValidator = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string().required(),
    });
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error, 200);
  }
};

const signInByPasswordValidator = async (req, res, next) => {
    try {
      const schema = Joi.object({
        email: Joi.string()
          .email({ tlds: { allow: false } })
          .required(),
        password: Joi.string().required(),
      });
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      return Responses.errorResponse(req, res, error, 200);
    }
};

module.exports = {
    signInByPasswordValidator,
    userRegisterValidator
}