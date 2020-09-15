const config = require("config");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { User } = require("./User");

const PaycardSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  cardNumber: {
    type: String
  },
  name: {
    type: String
  },
  expirydate: {
    type: String
  },

  cvv: {
    type: String
  }
});

const Paycard = new mongoose.model("Paycard", PaycardSchema);
module.exports.Paycard = Paycard;
