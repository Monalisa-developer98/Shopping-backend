const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
      },
      unique: true,
      index: true,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },
    subscriptionType:{
      type:String,
      required: true,
    },
    appliedCoupon: {
      code: {
        type: String,
        trim: true
      },
      discountAmount: {
        type: Number,
        default: 0
      },
      appliedOn: {
        type: Date
      }
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  },{
    timestamps: true
  });

const User = mongoose.model("User", userSchema);
module.exports = User;
