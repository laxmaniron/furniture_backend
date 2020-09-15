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
}).single("profilepicparse");

//Load User Model
const { User, validate } = require("../../models/User");

// @route   GET api/userinfo/test
// @descrip Tests userinfo route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "User Info works" }));

// @route   GET api/userinfo/register
// @descrip Register User
// @access  Public
router.post("/register", upload, async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  const { error } = validate(req.body);

  if (error) {
    console.log(error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }
  let isUser = await User.findOne({ username: req.body.username });
  if (isUser) {
    // errors.username = "Username already exists";
    return res.status(400).send("Username already exists");
  }

  isUser = await User.findOne({ email: req.body.email });
  if (isUser) {
    return res.status(400).send("An user already registered using above email");
  }

  let user = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    phoneno: req.body.phoneno,
    Address: req.body.Address,
    pincode: req.body.pincode,
    gender: req.body.gender,
    role: req.body.role,
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

// @route   GET api/userinfo/current
// @descrip Get Logged in user information
// @access  Private
router.get("/current", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

// @route   UPDATE api/userinfo/current
// @descrip Get Logged in user information
// @access  Private
router.put("/editprofile", upload, auth, async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  const old_user = await User.findById(req.user._id).select("-password");

  const newuser = {};

  if (req.body.firstname) {
    newuser.firstname = req.body.firstname;
  }

  if (req.body.lastname) {
    newuser.lastname = req.body.lastname;
  }

  if (req.body.email) {
    newuser.email = req.body.email;
  }

  if (req.body.phoneno) {
    newuser.phoneno = req.body.phoneno;
  }

  if (req.body.Address) {
    newuser.Address = req.body.Address;
  }

  if (req.body.pincode) {
    newuser.pincode = req.body.pincode;
  }

  if (req.file) {
    newuser.profilepic = req.file.path;
  }

  // console.log(newuser);

  const user = await User.findById(req.user._id);
  if (user) {
    //Update
    console.log("I am in right path");
    newone = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: newuser },
      { new: true }
    )
      .then()
      .catch(err => res.send({ errormessage: err }));
  } else {
    res.send({ errormessage: "invalid token" });
  }

  console.log(`hi   ${newone}`);

  res.send(newone);
});

router.put("/addAddress", auth, async (req, res) => {
  console.log(req.body);
  const old_user = await User.findById(req.body.user._id).select("-password");

  old_user.Address.push(req.body.address);
  old_user.pincode.push(req.body.pincode);

  // console.log(old_user);

  newone = await User.findOneAndUpdate(
    { _id: req.body.user._id },
    { $set: old_user },
    { new: true }
  )
    .then()
    .catch(err => res.send({ errormessage: err }));

  res.send(newone);
});

module.exports = router;
