const config = require("config");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { Dress } = require("./Dress");
const { User } = require("./User");

const CartSchema = mongoose.Schema({
  dressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dress"
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Cart = new mongoose.model("Cart", CartSchema);
module.exports.Cart = Cart;
