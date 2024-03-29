const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rapport5959@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
})

module.exports = transporter;