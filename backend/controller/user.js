//req is info coming from our front end eg json, images, etx
//res is info we giving as a response to front end
const nodemailer = require("nodemailer");
const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");
const { isValidObjectId } = require("mongoose");

exports.create = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res
      .status(401)
      .json({ error: "This email address is already being used" });
  }
  //aka --> new User({name:name, email:email, password:password});
  const newUser = new User({ name, email, password });
  await newUser.save();

  //generate 6 digit otp for user to validate email addresss
  let OTP = "";
  for (let i = 0; i < 5; i++) {
    const randomValue = Math.round(Math.random() * 9);
    OTP += randomValue;
  }

  //store OTP onto database
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  //send OTP to user email
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "083e74d6e72af1",
      pass: "bb0eb0c0844382",
    },
  });

  transport.sendMail({
    from: "verification@ReviewApplication.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `<p> Your Email Verification code is listed below: </p>
    <h1>${OTP}</h1>`,
  });

  res
    .status(201)
    .json({
      message: "Please verify your email through the OTP sent to your email",
    });
};

exports.verifyEmail = async(req, res) => {
    const { userId, OTP } = req.body;
    
    //check if userid in database 
    if(!isValidObjectId(userId)){
        return res.status(401).json({error: "Invalid User Id"});
    }
    const user = await User.findById(userId);
    if(!user){
        return res.status(401).json({error: "User not found"});
    }

    if(user.isVerified){
        return res.status(401).json({error: "User has already been verified"});
    }

    const token = await EmailVerificationToken.findOne({owner: userId});
    if(!token){
        return res.status(401).json({error: "Token not found"});
    }

    const isMatched = await token.compareTokens(OTP);
    if (!isMatched){
        return res.status(401).json({error: "OTP is invalid"});
    }

    user.isVerfied = true;
    await user.save();

    await EmailVerificationToken.findByIdAndDelete(token._id);

    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "083e74d6e72af1",
          pass: "bb0eb0c0844382",
        },
      });
    
      transport.sendMail({
        from: "verification@ReviewApplication.com",
        to: user.email,
        subject: "Welcome to Travel Review App",
        html: `<h1> Thank you for joining us. </h1>`,
      });

    res.status(200).json({message: "Thank you, email has been verified"});
}

exports.resendEmailVerificationToken = async(req, res) => {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if(!user){
        return res.status(401).json({error: "User not found"});
    }

    if(user.isVerified){
        return res.status(401).json({error: "Email is already verified"});
    }
    const alreadyHasToken = await EmailVerificationToken.findOne({owner: userId});
    if(alreadyHasToken){
        return res.status(401).json({error: "New token can be requested after an hour"});
    }

    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "083e74d6e72af1",
          pass: "bb0eb0c0844382",
        },
      });
    
      transport.sendMail({
        from: "verification@ReviewApplication.com",
        to: user.email,
        subject: "Welcome to Travel Review App",
        html: `<h1> Thank you for joining us. </h1>`,
      });
      res.json({message: "New OTP has been sent to your email addresss"});
}