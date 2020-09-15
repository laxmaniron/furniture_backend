const config = require("config");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { Dress } = require("./Dress");
const { User } = require("./User");

const WishlistSchema = mongoose.Schema({
  dressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dress"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Wishlist = new mongoose.model("Wishlist", WishlistSchema);
module.exports.Wishlist = Wishlist;
