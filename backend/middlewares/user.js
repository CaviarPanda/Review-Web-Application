const { isValidObjectId } = require("mongoose");
const passwordResetToken = require("../models/passwordResetToken");
const { sendError } = require("../utils/helper");

exports.isValidPasswordResetToken = async (req, res, next) => {
  const { token, userId } = req.body;

  const resetToken = await passwordResetToken.findOne({ owner: userId });

  if (!token.trim()|| !isValidObjectId(userId)) {
    return sendError(res, "Invalid Token request");
  }
  if (!resetToken) {
    return sendError(res, "No reset token found");
  }

  const matchedTokens = await resetToken.compareTokens(token);
  if (!matchedTokens) {
    return sendError(res, "Token does not match");
  }
  req.resetToken = resetToken;
  next();
};
