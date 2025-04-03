const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ["flat", "percentage"], required: true },
  value: { type: Number, required: true }, // Value could be a fixed amount (flat) or percentage
  startsFrom: { type: Date, required: true },
  endsOn: { type: Date, required: true },
});

module.exports = mongoose.model("Coupon", couponSchema);
