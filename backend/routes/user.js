const express = require("express");
const { verifyEmail, create, resendEmailVerificationToken } = require("../controller/user");
const { userValidator, validator } = require("../middlewares/validator");



const router = express.Router();

router.post("/create", userValidator, validator, create);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-token", resendEmailVerificationToken);



module.exports = router;
