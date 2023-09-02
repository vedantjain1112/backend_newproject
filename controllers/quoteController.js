const Quotes = require("../models/Quotes");

exports.getQuote = async (req, res) => {
  try {
    const quoteList = await Quotes.find();
    const quoteArray = quoteList.map((quoteDoc) => quoteDoc.quote);
    res.json(quoteArray);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.addQuote = async (req, res) => {
  try {
    const { quote } = req.body;
    const newQuote = new Quotes({ quote });
    await newQuote.save();
    res.status(201).json({ message: "Quote added successfully" });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
