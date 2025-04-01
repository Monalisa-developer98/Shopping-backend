const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");

// admin can create coupon
router.post(
  "/createCoupon",
  couponController.createCoupon
);

// get all coupons
router.get(
  "/all-coupons",
  couponController.getAllCoupons
);

// users can apply coupon
router.post(
    "/apply-coupon",
    couponController.applyCoupon
  );

module.exports = router;