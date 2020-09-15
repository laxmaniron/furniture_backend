const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const VendorUserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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
  company: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  profilepic: {
    type: String,
    required: true,
    default: "no picture"
  }
});
VendorUserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"), {
    expiresIn: 604800
  });
  return token;
};
const VendorUser = new mongoose.model("VendorUser", VendorUserSchema);

function ValidateVendorUser(VendorUser) {
  const schema = Joi.object({
    username: Joi.string()
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
    company: Joi.string()
      .min(8)
      .max(255)
      .required(),
    profilepic: Joi.string().required(),
    profilepicparse: Joi.any()
  });

  return schema.validate(VendorUser);
  // console.log(result);
}

module.exports.VendorUser = VendorUser;
module.exports.validate = ValidateVendorUser;
