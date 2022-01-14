"use strict";

const nodemailer = require("nodemailer");
const { welcomeAndVerify, forgotPassword } = require("./templates")
const { nodemailer:{ email, password }/*, baseUrl */, port } = require("../config");

const baseUrl=`http://localhost:${port}`;

let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
});

const mailConfigCreator = ({from = "", to = "", subject = "", html = ""}) => {
  return {
    from: from || `Markdown Blog <${email}>`,
    to,
    subject,
    html
  }
}

const mailTransporterCallback = (error, data) => {
  if (error) {
    console.log(`Error Occurred sending email with error: ${error}`);
  } else {
    console.log(`Email sent successfully!`);
  }
}

exports.sendForgotPasswordEmail = ({emailTo = "", fullName = "", userId = ""}) => {
    const mailConfig = mailConfigCreator({
      from: "",
      to: emailTo,
      subject: "Reset Password for your Markdown Blog Account",
      html: forgotPassword({fullName, userId, baseUrl, email}),
    });
    mailTransporter.sendMail(mailConfig, mailTransporterCallback);
}

exports.sendWelcomeAndVerifyEmail = ({emailTo = "", fullName = "", userId = ""}) => {
  const mailConfig = mailConfigCreator({
      from: "", 
      to: emailTo, 
      subject: "Welcome to Markdown Blog!",
      html: welcomeAndVerify({fullName, userId, email, baseUrl})
    });
  mailTransporter.sendMail(mailConfig, mailTransporterCallback);

}

