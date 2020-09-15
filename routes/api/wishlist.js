const Joi = require("@hapi/joi");
const _ = require("lodash");
const { Wishlist } = require("../../models/Wishlist");
const { Cart } = require("../../models/Cart");
const { Dress } = require("../../models/Dress");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// let user = await User.findOne({ username: req.body.username });
//   if (!user) {
//     return res.status(400).send("Invalid Username ");
//   }

router.post("/addtowishlist", async (req, res) => {
  let isInWishlist = await Wishlist.findOne({
    dressId: req.body.dressId,
    userId: req.body.userId
  });

  if (!isInWishlist) {
    console.log(req.body);
    let wishlist = new Wishlist({
      dressId: req.body.dressId,
      userId: req.body.userId
    });

    const worker = await wishlist.save();
    return res.send(worker);
  }

  return res.send("Item already in Wishlist");
});

router.get("/showwishlist", async (req, res) => {
  let userid = req.query.userid;

  userid = mongoose.Types.ObjectId(userid);

  const wishlistItems = await Wishlist.find({ userId: userid });

  dresses = [];

  for (var i = 0; i < wishlistItems.length; i++) {
    let dress;
    dress = await Dress.findOne({ _id: wishlistItems[i].dressId });
    dresses.push({ wishlistid: wishlistItems[i]._id, dress: dress });
  }
  res.send(dresses);
});

router.post("/movetocart", async (req, res) => {
  let wishlistid = req.body.wishlistid;

  wishlistid = mongoose.Types.ObjectId(wishlistid);

  const wishlistItems = await Wishlist.findOne({ _id: wishlistid });

  let isInCart = await Cart.findOne({
    dressId: wishlistItems.dressId,
    userId: wishlistItems.userId
  });

  if (!isInCart) {
    let cart = new Cart({
      dressId: wishlistItems.dressId,
      userId: wishlistItems.userId
    });

    const final_cart = await cart.save();

    await Wishlist.remove({ _id: wishlistid });
    return res.send(final_cart);
  }

  return res.send("Item already in Cart");
});

router.post("/deletefromwishlist", async (req, res) => {
  let wishlistid = req.body.wishlistid;

  wishlistid = mongoose.Types.ObjectId(wishlistid);

  console.log(wishlistid);

  deletedelement = await Wishlist.remove({ _id: wishlistid });
  console.log(deletedelement);
  res.send(deletedelement);
});

module.exports = router;
