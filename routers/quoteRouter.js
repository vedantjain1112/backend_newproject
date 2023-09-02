const express = require("express");
const router = express.Router();
const quoteController = require("../controllers/quoteController");

router.get("/quote", quoteController.getQuote);
router.post("/quote", quoteController.addQuote);

module.exports = router;
