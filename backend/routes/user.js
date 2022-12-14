const express = require("express");
const { create } = require('../controller/user');
const router = express.Router();

router.get("/", (req,res)=> {
    res.send("<h1>About this website: review app</h1>");
});

router.post("/create", create);

module.exports = router;