const config = require("config");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { Dress } = require("./Dress");
const { User } = require("./User");

const OrderSchema = mongoose.Schema({
  dressId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dress"
    }
  ],

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  ordered_date: {
    type: String
  },
  expected_delivery: {
    type: String
  },
  status: {
    type: String,
    enum: ["ordered", "in transit", "out for delivery", "delivered"]
  },

  delivered_date: {
    type: String
  },
  address: {
    type: String
  },

  cost: {
    type: String
  }
});

const Order = new mongoose.model("Order", OrderSchema);
module.exports.Order = Order;
