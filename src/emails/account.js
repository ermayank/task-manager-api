const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sgMail.send({
    to: 'mayank.pkgupta@gmail.com',
    from: 'mayank.pkgupta@gmail.com',
    subject: 'This is first email from sendgrid!',
    text: 'I hope it got u !'
})