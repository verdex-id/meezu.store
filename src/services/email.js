import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_AUTH_ADDRESS,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_SENDER_PASS,
  },
});

export async function sendEmail(to, subject, text, html) {
  return await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });
}
