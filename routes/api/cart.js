const Joi = require("@hapi/joi");
const _ = require("lodash");
const { Cart } = require("../../models/Cart");
const { Dress } = require("../../models/Dress");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/addtocart", async (req, res) => {
  let isInCart = await Cart.findOne({
    dressId: req.body.dressId,
    userId: req.body.userId
  });

  if (!isInCart) {
    console.log(req.body);
    let cart = new Cart({
      dressId: req.body.dressId,
      userId: req.body.userId
    });

    const final_cart = await cart.save();
    return res.send(final_cart);
  }

  return res.send("Item already in Cart");
});

router.get("/showcart", async (req, res) => {
  let userid = req.query.userid;

  userid = mongoose.Types.ObjectId(userid);

  const cartItems = await Cart.find({ userId: userid });

  dresses = [];

  for (var i = 0; i < cartItems.length; i++) {
    let dress;
    dress = await Dress.findOne({ _id: cartItems[i].dressId });
    dresses.push({ cartid: cartItems[i]._id, dress: dress });
  }
  res.send(dresses);
});

router.post("/deletefromcart", async (req, res) => {
  let cartid = req.body.cartid;

  cartid = mongoose.Types.ObjectId(cartid);

  deletedelement = await Cart.remove({ _id: cartid });
  res.send(deletedelement);
});

module.exports = router;
