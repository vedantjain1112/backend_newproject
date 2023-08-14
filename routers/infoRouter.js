const express = require("express");
const multer = require("multer");
const router = express.Router();
const infoController = require("../controllers/infoController");
const Info = require("../models/Info");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.get("/", infoController.getChaturmasData);

router.post("/add", upload.single("image"), async (req, res) => {
  try {
    console.log("Received request:", req.body);

    const imagePath = `uploads/${req.file.filename}`;

    const chaturmasEntry = new Info({
      name: req.body.name,
      image: imagePath,
      paragraph: req.body.paragraph,
      sthal: req.body.sthal,
    });

    const result = await infoController.createChaturmasEntry(chaturmasEntry);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating entry:", error);
    res.status(500).json({ message: "Error creating entry" });
  }
});

module.exports = router;
