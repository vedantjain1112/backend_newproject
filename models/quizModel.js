// const mongoose = require("mongoose");

// const questionSchema = new mongoose.Schema({
//   text: String,
//   answers: { type: Array, default: [] },
//   correct: Number,
//   // difficulty: { type: String, enum: ["easy", "medium", "hard"] },
// });

// module.exports = mongoose.model("Question", questionSchema);

// quizModel.js
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  answers: [String],
  correct: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"], // You can adjust the difficulty levels as needed
    required: true,
  },
});

module.exports = mongoose.model("Question", quizSchema);
