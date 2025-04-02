const mongoose = require("mongoose");
const validator = require("validator");

const clientSchema = new mongoose.Schema(
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
    subscriptionType: {
      type: String,
    },
    isSubscribedUser: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
