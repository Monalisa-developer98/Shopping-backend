const mongoose = require("mongoose");

// Subscription Plan Schema
const SubscriptionPlanSchema = new mongoose.Schema(
  {
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    effectFromDate: { type: Date, required: true },
    sellingPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    maxUser: { type: Number, required: true },
    validityInDays: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
