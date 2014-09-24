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
    var transporter = nodemailer.createTransport();
    transporter.sendMail({
      from: 'sender@address',
      to: 'receiver@address',
      subject: 'Test',
      html: req.body.text,
    });
  });
};