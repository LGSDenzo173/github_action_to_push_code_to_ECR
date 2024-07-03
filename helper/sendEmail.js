const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// sends email to the receiver from the given source
const sendEmail = (receiver, source, content) => {
    try {
        const msg = {
            to: receiver, // Change to your recipient
            from: source, // Change to your verified sender
            subject: 'Reset Password',
            html: content
        };
        return sgMail.send(msg);
    } catch (e) {
        return new Error(e);
    }
};

module.exports = sendEmail;