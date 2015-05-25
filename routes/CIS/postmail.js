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


    var subject = "[Share][STE Report] " + temp_date + " " + monthArray[temp_month] + " " + temp_year;

    var mailOptions = {
      from: 'GKProgress < GKProgress@lgerp.com>', // sender address
      to: ['yoonra.choi@lgepartner.com','hyeonah.park@lgepartner.com'], // list of receivers
      cc: ["rana.gong@lgepartner.com","ju.yeo@lge.com","stanislav.rastaturin@lge.com","ellen81.cho@lge.com","seulki.lee@lge.com","dmitry.politaev@lge.com","vitaliy.svistunov@lge.com","konstantin.safonov@lge.com","nursultan.daurenov@lge.com","kevinsj.park@lge.com","hyekseong.kweon@lge.com","yoonra.choi@lgepartner.com","edward.lee@lge.com","alla.chudzhaeva@lge.com","irina.vorobyova@lge.com","yury.kirillov@lge.com","jay.bae@lge.com","jhk79.kim@lge.com","jaeh8.kim@lge.com","vladimir.egorov@lge.com"],
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
