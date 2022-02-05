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

/**
 * @param {string} from From the Blog 
 * @param {string} to To whom the email is to be sent
 * @param {string} subject Subject of the email
 * @param {string} html Content of the email
 * @returns Mail Config Object
 */
const mailConfigCreator = ({from = "", to = "", subject = "", html = ""}) => {
  return {
    from: from || `Markdown Blog <${email}>`,
    to,
    subject,
    html
  }
}

/**
 * @description Callback function after sending email
 * @param {object} error Error object, in case of error while sending mail
 * @param {object} data Success object
 */
const mailTransporterCallback = (error, data) => {
  if (error) {
    console.log(`Error Occurred sending email with error: ${error}`);
  } else {
    console.log(`Email sent successfully!`);
  }
}

/**
 * @description Send Email to Reset Password
 * @param {string} emailTo To whom the email should be sent 
 * @param {string} fullName The user's full name 
 * @param {string} userId userId of the user
*/
exports.sendForgotPasswordEmail = ({emailTo = "", fullName = "", userId = ""}) => {
    const mailConfig = mailConfigCreator({
      from: "",
      to: emailTo,
      subject: "Reset Password for your Markdown Blog Account",
      html: forgotPassword({fullName, userId, baseUrl, email}),
    });
    mailTransporter.sendMail(mailConfig, mailTransporterCallback);
}

/**
 * @description Send Welcome and prompt User to verify email
 * @param {string} emailTo To whom the email should be sent 
 * @param {string} fullName The user's full name 
 * @param {string} userId userId of the user
*/
exports.sendWelcomeAndVerifyEmail = ({emailTo = "", fullName = "", userId = ""}) => {
  const mailConfig = mailConfigCreator({
      from: "", 
      to: emailTo, 
      subject: "Welcome to Markdown Blog!",
      html: welcomeAndVerify({fullName, userId, email, baseUrl})
    });
  mailTransporter.sendMail(mailConfig, mailTransporterCallback);

}

