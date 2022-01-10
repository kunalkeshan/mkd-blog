const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const { nodemailer:{ email, password }, baseUrl } = require("../config");

let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });
  
/**
 * @param  {String} emailTo To whom should the email to send to
 * @param  {String} fullName Name of the person to email
 */
exports.sendWelcomeEmail = ({emailTo, fullName}) => {
    const mailConfig = {
        from: `Team Markdown Blog <${email}>`,
        to: emailTo,
        subject: "Welcome to Markdown Blog!",
        html: `
            <h3>Hi ${fullName}!</h3>
            <p>Are you ready to embark on your writing journey? With <b>Markdown Blog</b> you can go up and beyond!</p>
            <div style="text-align:center;margin:20px 0 30px 0;">
            <a href="${baseUrl}" style="text-decoration:none;color:white;border:none;outline:none;padding:10px;background:#2596be;">Explore now</a>
            </div>
            <p>Need help, or have questions? Just reply to this email, we'd love to help.</p>
            <p>Cheers,</p>
            <p>Support Team</p>
        `,
    };
    mailTransporter.sendMail(mailConfig, (error, data) => {
        if (error) {
          console.log("Error Occurred", error);
        } else {
          console.log("Email sent successfully", data);
        }
    });
}

exports.forgotPasswordEmail = ({emailTo: fullName}) => {
    
}

