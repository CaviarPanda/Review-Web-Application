//req is info coming from our front end eg json, images, etx
//res is info we giving as a response to front end

const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");
const { isValidObjectId } = require("mongoose");
const { OTPGeneration, mailTransporterGeneration } = require("../utils/mail");
const { sendError } = require("../utils/helper");

exports.create = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return sendError(res,"This email address is already being used");
  }
  //aka --> new User({name:name, email:email, password:password});
  const newUser = new User({ name, email, password });
  await newUser.save();

  let OTP = OTPGeneration();

  //store OTP onto database
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  //send OTP to user email
  var transport = mailTransporterGeneration();

  transport.sendMail({
    from: "verification@ReviewApplication.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `<p> Your Email Verification code is listed below: </p>
    <h1>${OTP}</h1>`,
  });

  res.status(201).json({
    message: "Please verify your email through the OTP sent to your email",
  });
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  //check if userid in database
  if (!isValidObjectId(userId)) {
    return sendError(res,"Invalid User Id");
  }
  const user = await User.findById(userId);
  if (!user) {
    return sendError(res,"User not found");
  }

  if (user.isVerified) {
    return sendError(res,"User has already been verified");
  }

  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) {
    return sendError(res,"Token not found");
  }

  const isMatched = await token.compareTokens(OTP);
  if (!isMatched) {
    return sendError(res,"OTP is invalid");
  }

  user.isVerfied = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);

  var transport = mailTransporterGeneration();

  transport.sendMail({
    from: "verification@ReviewApplication.com",
    to: user.email,
    subject: "Welcome to Travel Review App",
    html: `<h1> Thank you for joining us. </h1>`,
  });

  res.status(200).json({ message: "Thank you, email has been verified" });
};

exports.resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return sendError(res,"User not found", 404);
  }

  if (user.isVerified) {
    return sendError(res,"Email is already verified");
  }

  const alreadyHasToken = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (alreadyHasToken) {
    return sendError(res,"New token can be requested after an hour");
  }

  // generate 6 digit otp
  let OTP = OTPGeneration();

  // store otp inside our db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  var transport = mailTransporterGeneration();

  transport.sendMail({
    from: "verification@ReviewApplication.com",
    to: user.email,
    subject: "Email Verification ",
    html: `
    <p>You verification OTP</p>
    <h1>${OTP}</h1>
  `,
  });
  res.json({ message: "New OTP has been sent to your email addresss" });
};
