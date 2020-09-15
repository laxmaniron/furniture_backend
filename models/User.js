const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 255
  },
  firstname: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255
  },
  lastname: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 4,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  phoneno: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10
  },
  Address: [
    {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024
    }
  ],
  pincode: [
    {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6
    }
  ],
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"]
  },
  role: {
    type: String,
    required: true,
    enum: ["designer", "customer", "vendor"]
  },
  profilepic: {
    type: String,
    required: true,
    default: "no picture"
  }
});
UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"), {
    expiresIn: 604800
  });
  return token;
};
const User = new mongoose.model("User", UserSchema);

function ValidateUser(User) {
  const schema = Joi.object({
    username: Joi.string()
      .min(4)
      .max(255)
      .required(),
    firstname: Joi.string()
      .min(4)
      .max(255)
      .required(),
    lastname: Joi.string()
      .min(4)
      .max(255)
      .required(),
    email: Joi.string()
      .min(4)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required(),
    phoneno: Joi.string()
      .min(10)
      .max(10)
      .required(),
    Address: Joi.any(),
    pincode: Joi.any(),
    gender: Joi.string().required(),
    role: Joi.string().required(),
    profilepic: Joi.string().required(),
    profilepicparse: Joi.any()
  });

  return schema.validate(User);
  // console.log(result);
}

module.exports.User = User;
module.exports.validate = ValidateUser;
