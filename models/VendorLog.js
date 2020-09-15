const config = require("config");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const VendorLogSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const VendorLog = new mongoose.model("VendorLog", VendorLogSchema);
module.exports.VendorLog = VendorLog;
