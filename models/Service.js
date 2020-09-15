const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const ServiceSchema = mongoose.Schema({
  sending_company: {
    type: String,
    required: true,

    minlength: 4,
    maxlength: 255
  },
  sender: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255
  },
  receiving_company: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255
  },
  result_image: {
    type: String,
    required: true,
    default: "no picture"
  }
});

const Service = new mongoose.model("Service", ServiceSchema);

function ValidateService(Service) {
  const schema = Joi.object({
    sending_company: Joi.string()
      .min(4)
      .max(255)
      .required(),
    sender: Joi.string()
      .min(4)
      .max(255)
      .required(),
    receiving_company: Joi.string()
      .min(4)
      .max(255)
      .required(),
    result_image: Joi.string().required(),
    resulting_imageparse: Joi.any()
  });

  return schema.validate(Service);
  // console.log(result);
}

module.exports.Service = Service;
module.exports.ValidateService = ValidateService;
