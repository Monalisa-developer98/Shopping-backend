const Responses = require("../helpers/response");
const couponService = require("../services/couponService");
const messages = require("../constants/constMessages");

const createCoupon = async (req, res) => {
  try {
    const result = await couponService.createCoupon(req.body);
    if (result?.isDuplicateCoupon) {
      return Responses.failResponse(
        req,
        res,
        null,
        messages.couponAlreadyExists,
        200
      );
    }
    return Responses.successResponse(
      req,
      res,
      result,
      messages.createdSuccess,
      201
    );
  } catch (error) {
    console.log(error);
    return Responses.errorResponse(req, res, error);
  }
};

const applyCoupon = async (req, res) => {
    try {
      const result = await couponService.applyCoupon(req.body);
      if (result?.isInValidCoupon) {
        return Responses.failResponse(
          req,
          res,
          null,
          messages.invalidCoupon,
          200
        );
      }
      if (result?.isExpiredCoupon) {
        return Responses.failResponse(
          req,
          res,
          null,
          messages.expiredCoupon,
          200
        );
      }
      return Responses.successResponse(
        req,
        res,
        result,
        messages.discountSuccess,
        200
      );
    } catch (error) {
      console.log(error);
      return Responses.errorResponse(req, res, error);
    }
  };

  const getAllCoupons = async (req, res) => {
    try {
      const result = await couponService.getAllCoupons();
      if (!result) {
        return Responses.failResponse(
          req,
          res,
          null,
          messages.couponNotFound,
          200
        );
      }
      return Responses.successResponse(
        req,
        res,
        result,
        messages.couponFound,
        200
      );
    } catch (error) {
      console.log(error);
      return Responses.errorResponse(req, res, error);
    }
  };

module.exports = {
  createCoupon,
  applyCoupon,
  getAllCoupons
};
