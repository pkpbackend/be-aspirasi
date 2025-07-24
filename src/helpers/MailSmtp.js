const nodemailer = require('nodemailer')

import { 
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
} from '../config/env'

// SMTP production ada disini
// const { SIBARU_SMTP } = require('../constants/ConstType')

async function sendMail(req) {
  let { to, subject, html, from, attachments } = req

  var transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: (parseInt(SMTP_SECURE) === 1?true:false), // true for 465, false for other ports
    auth: {
      user: SMTP_USER, // generated ethereal user
      pass: SMTP_PASS, // generated ethereal password
    },
  })

  const mailOptions = {
    from: from ? from : SMTP_USER, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // plain text body
    attachments,
  }

  return new Promise((resolve, reject) => {
    transporter
      .sendMail(mailOptions)
      .then((res) => {
        console.log(res, '=== res')
        resolve(res)
      })
      .catch((error) => {
        console.error(error)
        reject(error)
      })
  })
}

const MailSmtp = {
  sendMail,
}

module.exports = MailSmtp
