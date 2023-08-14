const authController = require("../controllers/authController");
const { verifyEmail } = require("../controllers/authController");
const router = require("express").Router();

router.post("/signup", authController.signupController);
router.get("/verify", authController.verifyMail);
router.post("/login", authController.loginController);
router.get("/refresh", authController.refreshAccessTokenController);
router.post("/logout", authController.logoutController);
router.post("/forgot-password", authController.forgotPasswordController);
router.post("/reset-password/:token", authController.resetPasswordController);

module.exports = router;
