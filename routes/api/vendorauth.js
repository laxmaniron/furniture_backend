const auth = require("../../middleware/auth");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const {
  VendorUser,
  vendorvalidate = validate
} = require("../../models/VendorUser");
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
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 },
  fileFilter: fileFilter
}).single("profilepicparse");

// @route   GET api/auth/test
// @descrip Tests auth route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Auth works" }));

// @route   GET api/userinfo/login
// @descrip Login User / Returning JWT Token
// @access  Public
router.post("/login", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await VendorUser.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).send("Invalid Username ");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.status(400).send("Password Incorrect");
  }

  const token = user.generateAuthToken();

  const gotUser = await VendorUser.findOne({
    username: req.body.username
  }).select("-password");

  console.log(gotUser._id);

  res.send({
    getuser: gotUser,
    token: token
  });
});

router.post("/register", upload, async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  const { error } = vendorvalidate(req.body);

  if (error) {
    console.log(error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }
  let isUser = await VendorUser.findOne({ username: req.body.username });
  if (isUser) {
    // errors.username = "Username already exists";
    return res.status(400).send("Username already exists");
  }

  isUser = await VendorUser.findOne({ email: req.body.email });
  if (isUser) {
    return res.status(400).send("An user already registered using above email");
  }

  let user = new VendorUser({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    company: req.body.company,
    profilepic: req.file.path
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user
        .save()
        .then(user => {
          const token = user.generateAuthToken();
          res.header("x-auth-token", token).json(user);
        })
        .catch(err => console.log(err));
    });
  });
});

module.exports = router;

function validate(req) {
  const schema = Joi.object({
    username: Joi.string()
      .min(4)
      .max(255)
      .required(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required()
  });

  return schema.validate(req);
}
