const express = require("express");
const { create } = require("../controller/user");
const { userValidator, validator } = require("../middlewares/validator");


const router = express.Router();

router.post("/create", userValidator, validator, create);

module.exports = router;
