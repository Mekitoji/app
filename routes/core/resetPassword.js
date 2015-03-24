var routesFunction = require('../../libs/routesFunction');
var User = require('../../models/user');
var nodemailer = require('nodemailer');
var async = require('async');

module.exports = function (app) {
  app.get('/reset/:token', routesFunction.alreadyLoginIn, function (req, res) {
    User.findOne({
      'resetPassword.token': req.params.token,
      'resetPassword.ExpiredDate': {
        $gt: Date.now()
      }
    }, function (err, user) {
      console.log(user);
      if (!user) {
        req.flash('error', 'Password token is invalid or has expired.');
        return res.redirect('/forgotPassword');
      }
      res.render('reset', {
        success: req.flash('success'),
        error: req.flash('error')
      });
    });
  });

  app.post('/reset/:token', function (req, res) {
    var token = req.params.token;
    async.waterfall([

      function (done) {
        User.findOne({
          'resetPassword.token': token,
          'resetPassword.ExpiredDate': {
            $gt: Date.now()
          }
        }, function (err, user) {
          if (!user) {
            req.flash('error', 'Password token is invalid or has expired.');
            return res.redirect('/forgotPassword');
          }
          if (req.body.password !== req.body.confirm) {
            req.flash('error', 'Password do not match');
            return res.redirect('/reset/' + token);
          }
          if (req.body.password.length < 6) {
            req.flash('error', 'Please create password with more than 5 symbols');
            return res.redirect('/reset/' + token);

          }
          var changePassword = new User();
          user.local.password = changePassword.generateHash(req.body.password);
          user.resetPassword = {
            token: null,
            ExpiredDate: null
          }
          user.save(function (err) {
            req.logIn(user, function (err) {
              done(err, user);
            });
          });
        });
      },
      function (user, done) {
        var transport = nodemailer.createTransport();
        var mailOptions = {
          to: user.local.email,
          from: 'Reset password < passwordreset@lgerp.com>',
          subject: 'Your password has been changed',
          text: 'Dear ' + user.local.username.first + ' ' + user.local.username.last + ',\n\n' +
            'Password to your account: ' + user.local.email + ', has just been changed.\n'
        };
        transport.sendMail(mailOptions, function (err) {
          req.flash('success', 'Success! Your password has been changed!');
          done(err);
        });
      }
    ], function (err) {
      res.redirect('/');
    })
  });
}