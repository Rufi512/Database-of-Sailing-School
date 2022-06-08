import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

export default transporter