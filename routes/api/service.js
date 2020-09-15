const auth = require("../../middleware/auth");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //accept on certain types of files

  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 },
  fileFilter: fileFilter
}).single("result_image");

//Load User Model
const { Service, ValidateService } = require("../../models/Service");

// @route   GET api/userinfo/test
// @descrip Tests userinfo route
// @access  Public
//router.get("/test", (req, res) => res.json({ msg: "User Info works" }));

// @route   GET api/userinfo/register
// @descrip Register User
// @access  Public
router.post("/postservice", async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  let service = new Service({
    sending_company: req.body.sending_company,
    sender: req.body.sender,
    receiving_company: req.body.receiving_company,
    result_image: req.body.result_image
  });
  service.save();

  res.send(service);
});

router.get("/getservice", async (req, res) => {
  const service = await Service.find();
  res.send(service);
});

// @route   GET api/userinfo/current
// @descrip Get Logged in user information
// @access  Private

// @route   UPDATE api/userinfo/current
// @descrip Get Logged in user information
// @access  Private

module.exports = router;
