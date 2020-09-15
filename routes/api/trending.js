const auth = require("../../middleware/auth");
const express = require("express");
const router = express.Router();
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

//var upload = multer();

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 },
  fileFilter: fileFilter
});

//Load User Model
const { Trending, ValidateTrending } = require("../../models/Trending");

// @route   GET api/userinfo/test
// @descrip Tests userinfo route
// @access  Public
//router.get("/test", (req, res) => res.json({ msg: "User Info works" }));

// @route   GET api/userinfo/register
// @descrip Register User
// @access  Public
router.post("/posttrends", upload.array("images", 3), async (req, res) => {
  console.log(req.files[0].path);
  //   var images = []
  var images = req.files;

  //const { error } = ValidateTrending(req.body);

  //if (error) {
  //  console.log(error.details[0].message);
  // return res.status(400).send(error.details[0].message);
  //}

  let trending = new Trending({
    content_image: req.files[0].path,
    style_image: req.files[1].path,
    result_image: req.files[2].path
  });

  trending.save();

  res.send(trending);
});

// @route   GET api/userinfo/current
// @descrip Get Logged in user information
// @access  Private
router.get("/gettrends", async (req, res) => {
  const trending = await Trending.find();
  res.send(trending);
});

// @route   UPDATE api/userinfo/current
// @descrip Get Logged in user information
// @access  Private

module.exports = router;
