const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const sendWelcomeEmail = (email, name) => {
//     sgMail.send({
//         to: email,
//         from: 'noreply@movieplanet.com',
//         subject: 'Thank you for joining in!',
//         text: `Welcome to the Movie Planet, ${name}. ...`
//     })
// }

const sendEmailWithTicket = (email, attachmentBase64) => {

    sgMail.send({
        to: email,
        from: 'noreply@movieplanet.com',
        subject: "Here are your tickets!",
        html: 
            '<p>Hello, in the attachment you can find the PDF of your order.</p><p>There is no need to print a ticket.</p><p>Just show QR code or tell a number of your order to our worker.</p><p>Both of them are also available in your profile.</p><p>Have a good time!</p>',
        attachments: [
          {
            content: attachmentBase64,
            filename: 'movie-planet-ticket.pdf',
            type: 'application/pdf',
            disposition: 'attachment',
            contentId: '244251781918'
          },
        ],
    })
}

const sendContactEmail = (form) => {
    sgMail.send({
        to: 'alexkolom27@gmail.com',
        from: 'noreply@movieplanet.com',
        subject: `Mail from guest. ${form.subject}`,
        text: `<strong>Name: ${form.name}</strong><strong>Email: ${form.email}</strong>
        <p>Message: ${form.message}</p>`
    })
}

// const sendCancelationEmail = (email, name) => {
//     sgMail.send({    `${tickets[0].orderNum}`
//         to: email,
//         from: 'no-reply@movieplanet.com',
//         subject: 'Sorry to see you go :(',
//         text: `Goodbye, ${name}. We hope to see you back sometime soon.`
//     })
// }

module.exports = {
    sendEmailWithTicket,
    sendContactEmail
}