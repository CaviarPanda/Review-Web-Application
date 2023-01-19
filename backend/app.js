// creating our first server localhost:8000

const express = require("express");
const { errorHandler } = require("./middlewares/error");
require("dotenv").config();
require("./db");
require("express-async-errors");

const userRouter = require("./routes/user");
const app = express();

//convert data coming from front end to json fomrat instead of chunk
app.use(express.json());

app.use("/api/user", userRouter);

app.use(errorHandler);

app.post(
  "/sign-in",
  (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ error: "Missing an email or password" });
    }
    next();
  },
  (req, res) => {
    res.send("<h1>Sign in Successful</h1>");
  }
);

app.listen(8000, () => {
  console.log("the port is listening 8000 port");
});
