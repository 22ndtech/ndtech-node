var nodemailer = require('nodemailer');
var aws = require('aws-sdk');
aws.config.update({ region: 'us-east-1' });

module.exports = function () {
    var mailer = {};

    mailer.sesTransport = nodemailer.createTransport({
        SES: new aws.SES({
            apiVersion: '2010-12-01'
        })
    });

    mailer.sendAdminEmail = (messageBody) => {
        let mail = {
            from: 'jeff@22ndtech.com', // sender address
            to: 'jeff@22ndtech.com', // list of receivers
            subject: '22ndtech-server Admin Email', // Subject line
            text: messageBody, // plain text body
            html: '<div>' + messageBody + '</div>' // html body
        };

        mailer.sesTransport.sendMail(mail, function (error, info) {
            if (error) {
                console.log("Error sending e-mail");
            }

            console.log("Admin Email Successfully sent");
        });
    }

    return mailer;
}



// // send some mail
// mailer.sesTransport.sendMail({
//     from: 'sender@example.com',
//     to: 'recipient@example.com',
//     subject: 'Message',
//     text: 'I hope this message gets sent!',
//     ses: { // optional extra arguments for SendRawEmail
//         Tags: [{
//             Name: 'tag name',
//             Value: 'tag value'
//         }]
//     }
// }, (err, info) => {
//     console.log(info.envelope);
//     console.log(info.messageId);
// });
