const path = require('path')
const EmailTemplates = require('email-templates')
const { sendMail } = require('~/utils/mailer')
const { templateList } = require('~/emails')
const createError = require('~/utils/create-error')
const { TEMPLATE_NOT_FOUND } = require('~/consts/errors')

const emailTemplates = new EmailTemplates({
  views: {
    root: path.resolve('src', 'emails')
  },
})

const emailService = {
  sendEmail: async (email, subject, language, text = {}) => {
    const templateToSend = templateList[subject][language]

    if (!templateToSend) {
      throw createError(404, TEMPLATE_NOT_FOUND)
    }

    const html = await emailTemplates.render(templateToSend.template, text)

    await sendMail({
      from: 'Booking.com',
      to: email,
      subject: templateToSend.subject,
      html,
    })
  }
}

module.exports = emailService
