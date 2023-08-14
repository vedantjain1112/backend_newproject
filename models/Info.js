const mongoose = require("mongoose");

const infoSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  sthal: {
    type: String,
    required: true,
  },
  paragraph: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("info", infoSchema);
