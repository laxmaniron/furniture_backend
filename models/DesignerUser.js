const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const DesignerUserSchema = mongoose.Schema({
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
DesignerUserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"), {
    expiresIn: 604800
  });
  return token;
};
const DesignerUser = new mongoose.model("DesignerUser", DesignerUserSchema);

function ValidateDesignerUser(DesignerUser) {
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

  return schema.validate(DesignerUser);
  // console.log(result);
}

module.exports.DesignerUser = DesignerUser;
module.exports.validate = ValidateDesignerUser;
