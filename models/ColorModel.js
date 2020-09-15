const config = require("config");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const { Dress } = require("./Dress");
mongoose.set("useCreateIndex", true);

const ColorModelSchema = mongoose.Schema({
  dressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dress"
  },
  color_dresspic: {
    type: String,
    required: true
  }
});

const ColorModel = new mongoose.model("ColorModel", ColorModelSchema);

function ValidateColorModel(ColorModel) {
  const schema = Joi.object({
    dressId: Joi.ObjectId().required(),
    color_dresspic: Joi.any()
  });

  return schema.validate(ColorModel);
}

module.exports.ColorModel = ColorModel;
module.exports.ValidateColorModel = ValidateColorModel;
