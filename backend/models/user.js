const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
  isVerified: {
    required: true,
    type: Boolean,
    default: false,
  },
});

//whenever we save file into db, before saving run this function
//hash function
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

//compare old password with new password
userSchema.methods.comparePasswords = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
  };
  
module.exports = mongoose.model("User", userSchema);
