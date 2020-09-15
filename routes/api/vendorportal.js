"use strict";
const auth = require("../../middleware/auth");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { VendorUser } = require("../../models/VendorUser");

var fs = require("fs");
var cmd = require("node-cmd");
const excelToJson = require("convert-excel-to-json");
const express = require("express");
const router = express.Router();
const { Dress, ValidateDress } = require("../../models/Dress");
const { ColorModel, ValidateColorModel } = require("../../models/ColorModel");
const {
  DressMainInfo,
  ValidateDressMainInfo
} = require("../../models/DressMainInfo");

const { VendorLog } = require("../../models/VendorLog");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "vendoruploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //accept on certain types of files

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// array("vendorfiles", 3);

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 },
  fileFilter: fileFilter
});

// @route   GET api/vendorportal/test
// @descrip Tests vendorportal route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "User Info works" }));

router.post(
  "/vendorfileupload",
  upload.array("vendorfiles[]", 3),
  async (req, res) => {
    // console.log(`Hi  ${req.files}`);

    const deletefiles = async () => {
      try {
        fs.unlinkSync("./vendoruploads/apparels.xlsx");
        fs.unlinkSync("./vendoruploads/colormodel.xlsx");
        fs.unlinkSync("./vendoruploads/apparels_maininfo.xlsx");
      } catch (err) {
        console.log("okay");
      }
    };

    let user = await VendorUser.findOne({ username: req.body.username });
    if (!user) {
      setTimeout(deletefiles, 5000, "funky");
      return res.status(400).send("Invalid Username ");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      setTimeout(deletefiles, 5000, "funky");
      return res.status(400).send("Password Incorrect");
    }
    setTimeout(deletefiles, 5000, "funky");

    let logdata = new VendorLog({
      username: user.username,
      company: user.company
    });

    await logdata.save();
    // return res.send("All Ok");

    console.log(`Hi  ${req.files}`);
    const excelData = excelToJson({
      sourceFile: "vendoruploads/apparels.xlsx",

      header: {
        rows: 1
      },

      // Mapping columns to keys
      columnToKey: {
        A: "name",
        B: "price",
        C: "cover_photo",
        D: "type",
        E: "cover_color",
        F: "brand",
        G: "discount",
        H: "tag",
        I: "gender",
        J: "next_page_link"
      }
    });

    console.log(excelData.Sheet1.length);

    Dress.collection.insertMany(excelData.Sheet1, function(err, docs) {
      if (err) {
        return console.error(err);
      } else {
        console.log("Multiple documents inserted to Collection");
      }
    });

    const colorData = excelToJson({
      sourceFile: "vendoruploads/colormodel.xlsx",

      header: {
        rows: 1
      },

      // Mapping columns to keys
      columnToKey: {
        A: "main_page_link",
        B: "page_color_link",
        C: "page_color_image_link"
      }
    });

    console.log(colorData.Sheet1.length);

    // let k;

    const finder = async color => {
      let k = await Dress.find();

      let ll = Object.keys(k);

      console.log(ll.length);

      let count, i;
      for (i = 0, count = 0; i < ll.length; i++) {
        let buffer = [];
        for (let j = 0; j < colorData.Sheet1.length; j++) {
          if (
            k[ll[i]]["next_page_link"] === colorData.Sheet1[j].main_page_link
          ) {
            if (!buffer.includes(colorData.Sheet1[j].page_color_link)) {
              ColorModel.collection.insertOne({
                dressId: k[ll[i]]["_id"],
                color_dresspic: colorData.Sheet1[j].page_color_image_link,
                page_color_link: colorData.Sheet1[j].page_color_link
              });
              count += 1;
              buffer.push(colorData.Sheet1[j].page_color_link);
            }
          }
        }
      }

      console.log(`count ${count}`);
    };

    setTimeout(finder, 2000, "funky");

    //   cmd.run("python3 main_loader.py");

    const maininserter = () => {
      var spawn = require("child_process").spawn;

      var process = spawn("python3", ["./main_loader.py"]);

      process.stdout.on("data", function(data) {
        console.log(data);
        fs.unlinkSync("./vendoruploads/apparels.xlsx");
        fs.unlinkSync("./vendoruploads/colormodel.xlsx");
        fs.unlinkSync("./vendoruploads/apparels_maininfo.xlsx");
      });
    };

    setTimeout(maininserter, 6000);

    res.json({ msg: "file upload Info works" });
  }
);

module.exports = router;
