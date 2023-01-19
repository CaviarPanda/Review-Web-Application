const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database has been connected");
  })
  .catch((ex) => {
    console.log("database has not been connected successfully:", ex);
  });
