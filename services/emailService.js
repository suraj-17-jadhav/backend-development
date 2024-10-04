const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'jadhavsuraj0149@gmail.com',
            pass: 'bkni cmup butb frut',
        },
    }
)

const sendEmail= async(to, subject, text, html)=>{
   try {
    const mailOptions = {
        from: 'jadhavsuraj0149l@gmail.com',
        to: to,
        subject: subject,
        text: text,
        html: html,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info
   } catch (error) {
    console.error('Error sending email:', error);
    throw error;
   }
}

const sendVerificationEmail =async(email, subject, text) => {
    try {
        const mailOptions = {
          from: 'jadhavsuraj0149l@gmail.com',
          to: email,
          subject: subject,
          text: text
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }   
};

module.exports = {sendEmail , sendVerificationEmail };