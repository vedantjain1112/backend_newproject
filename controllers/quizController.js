const quizModel = require("../models/quizModel");

const getQuestions = async (req, res) => {
  try {
    const { difficulty } = req.query; // Get the difficulty level from the query parameters
    const query = difficulty ? { difficulty } : {}; // Create a query object based on the difficulty

    const questions = await quizModel.find(query);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const addQuestion = async (req, res) => {
  try {
    const { text, answers, correct, difficulty } = req.body;

    if (
      !text ||
      !Array.isArray(answers) ||
      answers.length === 0 ||
      isNaN(correct) ||
      !["easy", "medium", "hard"].includes(difficulty)
    ) {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    const newQuestion = new quizModel({
      text: text,
      answers: answers,
      correct: correct,
      difficulty: difficulty,
    });

    const savedQuestion = await newQuestion.save();
    res.json(savedQuestion);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    await quizModel.findByIdAndDelete(questionId);
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = { getQuestions, addQuestion, deleteQuestion };
