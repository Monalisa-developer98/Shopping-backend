const Coupon = require("../models/couponModel");

// create Coupon
const createCoupon = async (couponData) => {
  const existingCoupon = await Coupon.findOne({
    code: couponData.code,
    isActive: true,
  });
  if (existingCoupon) {
    return {
      isDuplicateCoupon: true,
    };
  }
  const coupon = new Coupon(couponData);
  const result = await coupon.save();
  return result;
};

// users can apply coupon
const applyCoupon = async (data) => {
  const coupon = await Coupon.findOne({ code: data.code, isActive: true });
  if (!coupon) {
    return {
      isInValidCoupon: true,
    };
  }
  if (new Date() > new Date(coupon.expiryDate)) {
    return {
      isExpiredCoupon: true,
    };
  }
  const discount = Math.min((data.total * coupon.discount) / 100);
  const discountedPrice = data.total - discount;
  data.discountPercentage = coupon.discount
  return {"Items details":data, "discounted Price": discountedPrice};
};

// get all coupons
const getAllCoupons = async () => {
  const currentDate = new Date();
  const coupons = await Coupon.find({ isActive: true, expiryDate: { $gte: currentDate } });
  return coupons;
};

module.exports = {
  createCoupon,
  applyCoupon,
  getAllCoupons
};
