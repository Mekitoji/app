var nodemailer = require('nodemailer');

module.exports = function (app) {
  app.get('/postmail', function (req, res) {
    if (req.user) {
      res.render('postmail.ejs', {
        user: req.user // get the user out of session and pass to template
      });
    } else {
      res.render('postmail.ejs', {
        user: {
          local: {
            username: {
              first: 'Login or ',
              last: 'signup'
            },
            group: 'Guest'
          }
        }
      });
    }



  });

  app.post('/postmail', function (req, res) {
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