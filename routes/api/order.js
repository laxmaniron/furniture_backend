const Joi = require("@hapi/joi");
const _ = require("lodash");
const { Order } = require("../../models/Order");
const { Dress } = require("../../models/Dress");
const { Cart } = require("../../models/Cart");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");

router.post("/addtoorders", async (req, res) => {
  // console.log(req.body);

  const cartItems = await Cart.find({ userId: req.body.user._id });

  let dressesId = [];

  for (var i = 0; i < cartItems.length; i++) {
    // console.log(cartItems[i]);
    dressesId.push(cartItems[i].dressId);

    await Cart.remove({ _id: cartItems[i]._id });
  }

  console.log(dressesId);

  status = "ordered";
  delivered_date = "null";

  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  var expected_delivery = date;

  let order = new Order({
    dressId: dressesId,
    userId: req.body.user._id,
    ordered_date: date,
    expected_delivery: expected_delivery,
    status: status,
    delivered_date: delivered_date,
    address: req.body.address,
    cost: req.body.cost
  });

  const final_order = await order.save();
  res.send(final_order);
});

router.get("/showorders/", async (req, res) => {
  let userid = req.query.userid;

  userid = mongoose.Types.ObjectId(userid);

  const orderItems = await Order.find({ userId: userid });

  let orders = [];

  for (var i = 0; i < orderItems.length; i++) {
    dresses = [];
    for (var j = 0; j < orderItems[i].dressId.length; j++) {
      let dress;
      dress = await Dress.findOne({ _id: orderItems[i].dressId[j] });
      // console.log(dress);
      dresses.push(dress);
    }

    // console.log(dresses);

    let order = {
      dresses: dresses,
      _id: orderItems[i]._id,
      userId: orderItems[i].userId,
      ordered_date: orderItems[i].ordered_date,
      expected_delivery: orderItems[i].expected_delivery,
      status: orderItems[i].status
    };

    orders.push(order);
  }

  res.send(orders);
});

module.exports = router;
