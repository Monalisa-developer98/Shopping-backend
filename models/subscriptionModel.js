const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true},
  descriptions: [
    {
      id: { type: Number, required: true },
      description: { type: String, required: true, trim: true }
    }
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Subscription", SubscriptionSchema);