const express = require("express");
const quizController = require("../controllers/quizController");

const router = express.Router();

router.get("/api/questions", quizController.getQuestions);
router.post("/api/questions", quizController.addQuestion);
router.delete("/questions/:questionId", quizController.deleteQuestion);

module.exports = router;
