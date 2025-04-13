const nodemailer = require("nodemailer");
const logger = require("../utils/logger");
const config = require("../utils/config");
const Users = require("../models/usermodel");

// Configure Transporter (Initialized Once)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

// Generic Email Sending Function
const sendEmail = async (
  userEmail,
  subject = "Verify your OTP",
  htmltext = ""
) => {
  try {
    const mailOptions = {
      from: `"YCTCSCREPO" <${config.EMAIL_USER}>`,
      to: userEmail,
      subject: subject,
      html: htmltext,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email successfully sent to ${userEmail}: ${info.messageId}`);
  } catch (err) {
    logger.error("Error sending email:", err);
    throw new Error("Email service unavailable");
  }
};

// Function to Send OTP Email
const sendOtpEmail = async (userEmail, otp) => {
  try {
    const subject = "Verify Your Email - OTP Code";
    const html = `
      <div style="background-color: #f0f0f0; padding: 20px; max-width: 640px; margin: auto;">
        <section style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h1 style="color: #086D00;">YCTCSCREPO</h1>
          <h3>Email Verification</h3>
          <p>Your verification code is: <b>${otp}</b>. Do not share this code with anyone. OTP expires in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </section>
      </div>`;

    await sendEmail(userEmail, subject, html);
  } catch (err) {
    logger.error("Error in sendOtpEmail:", err.message);
    throw err;
  }
};

async function sendApprovalEmailToContributors(book) {
  const users = await Users.find({ _id: { $in: book.contributors } });

  const emails = users.map(u => u.email).filter(Boolean);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  for (const email of emails) {
    await transporter.sendMail({
      from: config.EMAIL_USER,
      to: email,
      subject: '✅ Your Book Has Been Approved!',
      html: `
        <p>Hi there,</p>
        <p>Your book <strong>${book.title}</strong> has just been approved by an admin and is now available in the repository.</p>
        <p><a href="https://yourfrontend.com/books/${book._id}">View Book</a></p>
        <p>Thanks for sharing knowledge!</p>
      `,
    });
  }
}


async function sendRejectedEmailToContributors(book, reason) {
  const users = await Users.find({ _id: { $in: book.contributors } });

  const emails = users.map(u => u.email).filter(Boolean);

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });

  for (const email of emails) {
    await transporter.sendMail({
      from: config.EMAIL_USER,
      to: email,
      subject: '✅ Your Book Has Been Rejected!',
      html: `
        <p>Hi there,</p>
        <p>Your book <strong>${book.title}</strong> has just been rejected by an admin and is no longer available in the repository.</p>
        <p>Reason: ${reason}</p>
        <p>Thanks for sharing knowledge!</p>
      `,
    });
  }
}


module.exports = { sendOtpEmail, sendEmail, sendApprovalEmailToContributors, sendRejectedEmailToContributors };
