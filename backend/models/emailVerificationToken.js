const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const emailVerificationSchema = mongoose.Schema({
  // Object Id is how we will store the newUser object (name, email, password)
  // ref is model name from UserSchema
  owner: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  token: {
    required: true,
    type: String,
  },
  createAt: {
    required: true,
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

//hash function for token
emailVerificationSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

//compare hashed OTP stored in mongodb with actual token
emailVerificationSchema.methods.compareTokens = async function(token) {
    const result = await bcrypt.compare(token, this.token);
    return result;
}

module.exports = mongoose.model(
  "EmailVerificationToken",
  emailVerificationSchema
);
