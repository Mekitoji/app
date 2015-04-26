var nodemailer = require('nodemailer');
var routesFunction = require('../../libs/routesFunction');
module.exports = function (app) {
  app.get('/cis/:year/postmail', routesFunction.checkPermissionGkCIS, function (req, res, next) {
    res.locals.path = req.path;
    res.locals.year = req.params.year;
    if (req.user) {
      res.render('postmail.ejs', {
        user: req.user // get the user out of session and pass to template
      });
    }

  });

  app.post('/cis/postmail', routesFunction.checkPermissionGkCIS, function (req, res) {
    var transport = nodemailer.createTransport();

    var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var temp = new Date();
    var temp_date = temp.getDate();
    var temp_month = temp.getMonth();
    var temp_year = temp.getFullYear();


    var subject = "[Share][GK Progress] " + temp_date + " " + monthArray[temp_month] + " " + temp_year;

    var mailOptions = {
      from: 'GKProgress < GKProgress@lgerp.com>', // sender address
      to: 'vladimir.egorov@lge.com', // list of receivers
      cc: ['andrey.sayants@lge.com'],
      subject: subject, // Subject line
      replyTo: 'andrey.sayants@lge.com',
      text: req.body.text, // plaintext body
      html: req.body.text, // html body
    };
    console.log(subject);
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