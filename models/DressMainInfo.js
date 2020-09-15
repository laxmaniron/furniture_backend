const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { ColorModel } = require("./ColorModel");
mongoose.set("useCreateIndex", true);

const DressMainInfoSchema = mongoose.Schema({
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ColorModel"
  },
  smallimageset: [
    {
      type: String,
      required: true
    }
  ],
  hdimageset: [
    {
      type: String,
      required: true
    }
  ],
  price: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 25
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
  color: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 300
  },

  description: mongoose.Schema.Types.Mixed,

  size_n_fit: mongoose.Schema.Types.Mixed
});

const DressMainInfo = new mongoose.model("DressMainInfo", DressMainInfoSchema);

function ValidateDressMainInfo(DressMainInfo) {
  const schema = Joi.object({
    colorId: Joi.ObjectId().required(),
    smallimageset: Joi.array().required(),
    hdimageset: Joi.array().required(),
    price: Joi.string()
      .min(1)
      .max(25)
      .required(),
    discount: Joi.required(),
    tag: Joi.string().required(),
    color: Joi.string()
      .min(1)
      .max(300)
      .required(),
    description: Joi.required(),
    size_n_fit: Joi.required()
  });

  return schema.validate(DressMainInfo);
}

module.exports.DressMainInfo = DressMainInfo;
module.exports.ValidateDressMainInfo = ValidateDressMainInfo;
