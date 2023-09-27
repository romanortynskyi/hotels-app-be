const nodemailer = require('nodemailer')

const createError = require('~/utils/create-error')
const { EMAIL_NOT_SENT } = require('~/consts/errors')

const sendMail = async (mailOptions) => {
  try {
    const { MAIL_USER, MAIL_PASSWORD } = process.env
    
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    
    const result = await transporter.sendMail(mailOptions)
    transporter.close()

    return result
  } catch (err) {console.error(err)
    throw createError(500, EMAIL_NOT_SENT)
  }
}

module.exports = { sendMail }
