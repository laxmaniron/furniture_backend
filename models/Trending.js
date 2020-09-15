const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const TrendingSchema = mongoose.Schema({
  content_image: {
    type: String,
    required: true,
    default: "no picture"
  },
  style_image: {
    type: String,
    required: true,
    default: "no picture"
  },
  result_image: {
    type: String,
    required: true,
    default: "no picture"
  }
});

const Trending = new mongoose.model("Trending", TrendingSchema);

function ValidateTrending(Trending) {
  const schema = Joi.object({
    content_image: Joi.string().required(),
    content_imageparse: Joi.any(),
    style_image: Joi.string().required(),
    style_imageparse: Joi.any(),
    result_image: Joi.string().required(),
    result_imageparse: Joi.any()
  });

  return schema.validate(Trending);
  // console.log(result);
}

module.exports.Trending = Trending;
module.exports.ValidateTrending = ValidateTrending;
