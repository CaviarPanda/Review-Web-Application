const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/review_app")
  .then(() => {
    console.log("database has been connected");
  })
  .catch((ex) => {
    console.log("database has not been connected successfully:", ex);
  });
