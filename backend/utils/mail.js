const nodemailer = require("nodemailer");

//generate 6 digit otp for user to validate email addresss
exports.OTPGeneration = (length = 6) => {
  let OTP = "";
  for (let i = 0; i < length; i++) {
    const randomValue = Math.round(Math.random() * 9);
    OTP += randomValue;
  }
  return OTP;
};

exports.mailTransporterGeneration = () => {
  var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "083e74d6e72af1",
      pass: "bb0eb0c0844382",
    },
  });
  return transport;
};
