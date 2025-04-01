const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const cartController = require("../controllers/cartController");

// add-to-cart
router.post(
  "/add-to-cart",
  authMiddleware.verifyUserToken,
  cartController.addToCart
);

// view-cart
router.get(
    "/view-cart",
    authMiddleware.verifyUserToken,
    cartController.viewCart
  );

// remove from cart
router.delete("/remove/:productId", cartController.removeFromCart);

module.exports = router;