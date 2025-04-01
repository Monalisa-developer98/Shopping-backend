const Responses = require("../helpers/response");
const authService = require("../services/authService");
const messages = require("../constants/constMessages");

// user registration
const registerUser = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    if (result?.isDuplicateEmail) {
      return Responses.failResponse(
        req,
        res,
        null,
        messages.userAlreadyExists,
        200
      );
    }
    return Responses.successResponse(
      req,
      res,
      result,
      messages.registerSuccessful,
      201
    );
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};

// login by password
const signInByPassword = async (req, res) => {
  try {
    const result = await authService.signInByPassword(req.body);
    if (!result) {
      return Responses.failResponse(req, res, null, messages.userNotFound, 200);
    }
    if (result?.incorrectPassword) {
      return Responses.failResponse(
        req,
        res,
        null,
        messages.incorrectPassword,
        200
      );
    }
    return Responses.successResponse(
      req,
      res,
      result,
      messages.signInSuccess,
      200
    );
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};

module.exports = {
  registerUser,
  signInByPassword,
};
