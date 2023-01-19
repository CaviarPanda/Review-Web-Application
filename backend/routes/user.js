const express = require("express");
const {
  verifyEmail,
  create,
  resendEmailVerificationToken,
  forgetPassword,
  sendResetTokenPasswordStatus,
  resetPassword,
  signIn,
} = require("../controller/user");
const { isValidPasswordResetToken } = require("../middlewares/user");
const { validatePassword, userValidator, validator, signInValidator } = require("../middlewares/validator");

const router = express.Router();

router.post("/create", userValidator, validator, create);
router.post("/sign-in", signInValidator, validator,signIn), 
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-token", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post(
  "/verify-password-reset-token",
  isValidPasswordResetToken,
  sendResetTokenPasswordStatus
);
router.post(
  "/reset-password",
  validatePassword,
  validator,
  isValidPasswordResetToken,
  resetPassword
);

module.exports = router;
