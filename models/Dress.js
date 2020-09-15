const config = require("config");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const DressSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 511
  },
  price: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 25
  },
  cover_photo: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  cover_color: {
    type: Object,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  brand: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255
  },
  discount: {
    type: mongoose.Decimal128,
    required: true
  },
  tag: {
    type: String,
    required: true,
    default: "notag"
  },
  gender: {
    type: String,
    required: true,
    enum: ["Men", "Women", "Kids"]
  },
  next_page_link: {
    type: String,
    required: true
  }
});

const Dress = new mongoose.model("Dress", DressSchema);

function ValidateDress(Dress) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(511)
      .required(),
    price: Joi.string()
      .min(1)
      .max(25)
      .required(),
    cover_photo: Joi.any(),
    type: Joi.string()
      .min(2)
      .max(255)
      .required(),
    cover_color: Joi.string()
      .min(1)
      .max(255)
      .required(),
    brand: Joi.string()
      .min(1)
      .max(255)
      .required(),
    discount: Joi.required(),
    tag: Joi.string().required(),
    gender: Joi.string().required()
  });

  return schema.validate(Dress);
}

module.exports.Dress = Dress;
module.exports.ValidateDress = ValidateDress;
