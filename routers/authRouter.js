const express = require("express");
const router = express.Router();
const validator = require("../validators/authValidator");
const authController = require("../controllers/authController");

// http://localhost:8089/api/V1/auth/register
router.post(
  "/register",
  validator.userRegisterValidator,
  authController.registerUser
);

// http://localhost:8089/api/V1/auth/signInByPassword
router.post(
  "/signInByPassword",
  validator.signInByPasswordValidator,
  authController.signInByPassword
);

module.exports = router;
