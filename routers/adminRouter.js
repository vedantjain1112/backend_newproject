const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const requireuser = require("../middlewares/requireUser");

const lc = authController.loginController;
router.post("/", requireuser, lc, adminController.createInfo);

module.exports = router;
