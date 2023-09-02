const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("quote", quoteSchema);
