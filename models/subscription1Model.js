const mongoose = require("mongoose");

const SubscriptionManagementSchema = new mongoose.Schema({
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
    required: true,
  },
  effectFromDate: { type: Date, required: true },
  sellingPrice: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  maxUsers: { type: Number, required: true },
  validityDays: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("SubscriptionManagement", SubscriptionManagementSchema);
