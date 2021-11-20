const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    console.log(`email ${email} name ${name}`)
    sgMail.send({
        to: email,
        from: 'plee61@hotmail.com',
        subject: `Hello ${name}`,
        text: `Welcome ${name}. Please let me know when you receive this email.` 
    }, (err, success)=>{
            if (err) {
                console.log(`sendWelcomeEmail: ${err}`)
            }
            
    })
}
const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'plee61@hotmail.com',
        subject: 'Sorry to see you go',
        text: `Thank you ${name} for your support. Please leave us your valuable feedback.` 
    }, (err, success)=>{
            if (err) {
                console.log(err)
            }
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}
// sgMail.send({
//     to: 'plee61@hotmail.com',
//     from: 'plee61@hotmail.com',
//     subject: 'Sendmail tutorial',
//     text: 'Please let me know when you receive this email.'
// }, (err, success)=>{
//     if (err) {
//         console.log(err)
//     }
// })