const router = require("express").Router();
const dataController = require("../controllers/dataController");
const requireUser = require("../middlewares/requireUser");

router.get("/all", requireUser, dataController.getAlldataController);

module.exports = router;
