var nodemailer = require('nodemailer');
var routesFunction = require('../libs/routesFunction');
module.exports = function (app) {
  app.get('/postmail', routesFunction.checkPermission, function (req, res, next) {
    if (req.user) {
      res.render('postmail.ejs', {
        user: req.user // get the user out of session and pass to template
      });
    }

  });

  app.post('/postmail', routesFunction.checkPermission, function (req, res) {
    console.log(req.body.text);
    var transport = nodemailer.createTransport();

    var mailOptions = {
      from: 'Tester <test@lgerp.com>', // sender address
      to: 'vladimir.egorov@lge.com', // list of receivers
      cc: ['andrey.sayants@lge.com'],
      subject: 'Hello', // Subject line
      text: req.body.text, // plaintext body
      html: req.body.text, // html body
    };

    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent: ');
        console.log(info);
      }
    });

  });
};