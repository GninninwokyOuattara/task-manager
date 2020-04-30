const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const msg = {
//     to: "idrissgouattara@gmail.com",
//     from: "idrissgouattaraonline@gmail.com",
//     subject: "Sending with Twilio SendGrid is Fun",
//     text: "and easy to do anywhere, even with Node.js",
//     html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };

// sgMail
//     .send(msg)
//     .then((e) => {
//         console.log("success");
//     })
//     .catch((e) => {
//         console.log(e);
//     });

const sendWelcomeMail = (email, name) => {
    const msg = {
        to: email,
        from: "idrissgouattaraonline@gmail.com",
        subject: "Welcome",
        text:
            "Thanks for joining in to our app ! We hope you have a great time !",
    };

    sgMail.send(msg);
};

const sendGoodByeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: "idrissgouattaraonline@gmail.com",
        subject: "Good Bye",
        text: `Good bye ${name}, we're sorry to see you go ! `,
    });
};

module.exports = {
    sendWelcomeMail,
    sendGoodByeMail,
};
