const Info = require("../models/Info");

const createInfo = async (req, res) => {
  try {
    const newInfo = new Info(req.body);
    await newInfo.save();
    res.status(201).json(newInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createInfo,
};
