const config = require("config");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const DesignerLogSchema = mongoose.Schema({
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

const DesignerLog = new mongoose.model("DesignerLog", DesignerLogSchema);
module.exports.DesignerLog = DesignerLog;
