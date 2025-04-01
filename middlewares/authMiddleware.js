const jwt = require("jsonwebtoken");
const Responses = require("../helpers/response");
const messages = require("../constants/constMessages");
const userService = require("../services/userService");

const generateUserToken = async (data) => {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Data must be a plain object');
    }
  
    const token = jwt.sign(data, process.env.JWT_USER_SECRET, {
      expiresIn: '365d',
    });
    return `Bearer ${token}`;
  };
  

  const verifyUserToken = async (req, res, next) => {
    try {
      let token = req.headers.authorization;
      console.log("token-->", token);
      if (token && token.startsWith("Bearer ")) {
        token = token.substring(7, token.length);
      }
      const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
      console.log("Decoded------------", decoded);
      const email = decoded.email;
      console.log("Decoded email ------------", email);
      console.log("authService methods:", Object.keys(userService));
      const isActiveUser = await userService.verifyEmployee(email);
      console.log("isActiveUser------", isActiveUser);
      if (isActiveUser) {
        req.userData = isActiveUser;
        next();
      } else {
        console.log("return from jwt verify");
        return Responses.failResponse(
          req,
          res,
          { isInValidUser: true },
          messages.invalidUser,
          200
        );
      }
    } catch (error) {
      console.log("Errorrr", error);
      return Responses.failResponse(req, res, null, messages.invaliToken, 200);
    }
  };

module.exports = {
    generateUserToken,
    verifyUserToken
}