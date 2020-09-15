const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// var jwtDecode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const { DesignerUser } = require("../../models/DesignerUser");

const { DesignerLog } = require("../../models/DesignerLog");

// const config = require("../../middleware/config");

const { Dress } = require("../../models/Dress");
const { ColorModel } = require("../../models/ColorModel");
const { DressMainInfo } = require("../../models/DressMainInfo");

router.get("/trending", auth, async (req, res) => {
  trendingdresses = await Dress.find({ tag: "trending" });

  console.log(req.user);

  let user = await DesignerUser.findOne({ _id: req.user._id });

  let logdata = new DesignerLog({
    username: user.username,
    company: user.company
  });

  await logdata.save();

  let finalresult = [];

  let k = 0;
  for (var i = 0; i < trendingdresses.length; i++) {
    let dress = await Dress.findOne({ _id: trendingdresses[i]._id });
    let color_dress = await ColorModel.findOne({
      page_color_link: dress.next_page_link
    });

    let main_info = await DressMainInfo.findOne({
      colorId: color_dress._id
    });

    if (main_info) {
      k = k + 1;
    }

    for (var j = 0; j < main_info.hdimageset.length; j++) {
      if (main_info.hdimageset[j].includes("filter=packshot")) {
        let output = {
          dressId: dress._id,
          dressname: dress.name,
          image: main_info.hdimageset[j]
        };
        console.log(output);
        finalresult.push(output);
      }
    }
  }

  console.log(finalresult.length);
  res.send(finalresult);
});

module.exports = router;
