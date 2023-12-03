import nodemailer from "nodemailer";

import { dev } from "../config/server";
import { EmailDataType } from "../types";
//!step1: create a transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 455 false for other port number
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: dev.app.smtpUserName,
    pass: dev.app.smtpUserPssword,
  },
});

//!step2: create a function to send the email
export const handleSendEmail = async (emailDate: EmailDataType) => {
  try {
    const mailOption = {
      //all this information from emailDate
      from: dev.app.smtpUserName,
      to: emailDate.email,
      subject: emailDate.subject,
      html: emailDate.html,
    };
    //!send the email with the help of the transporter
    const info = await transporter.sendMail(mailOption);
    console.log("message send secsassfully" + info.response);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
