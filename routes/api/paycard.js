const Joi = require("@hapi/joi");
const _ = require("lodash");
const { Paycard } = require("../../models/Paycard");
const { User } = require("../../models/User");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");

router.post("/addcard", async (req, res) => {
  console.log(req.body);
  let paycard = new Paycard({
    userId: req.body.user._id,
    cardNumber: req.body.cardNumber,
    name: req.body.name,
    expirydate: req.body.expirydate,
    cvv: req.body.cvv
  });

  const final_paycard = await paycard.save();
  res.send(final_paycard);
});

router.get("/showcards/", async (req, res) => {
  console.log(req.query);
  let userid = req.query.userid;

  userid = mongoose.Types.ObjectId(userid);

  console.log(userid);
  console.log(typeof userid);

  cards = await Paycard.find({ userId: userid });

  return res.send(cards);
});

module.exports = router;
