const Order = require("../models/ordersModel");

// create Order
const createOrder = async (couponData) => {
  if (existingCoupon) {

  }
  const coupon = new Coupon(couponData);
  const result = await coupon.save();
  return result;
};


module.exports = {
    createOrder,
};
