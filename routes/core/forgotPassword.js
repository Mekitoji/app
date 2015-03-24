var routesFunction = require('../../libs/routesFunction');
var async = require('async');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var User = require('../../models/user');

module.exports = function (app, passport) {
  app.get('/forgotPassword', routesFunction.alreadyLoginIn, function (req, res) {
    res.locals.path = req.path;
    res.render('forgotPassword', {
      error: req.flash('error'),
      success: req.flash('success')
    });
  });

  app.post('/forgotPassword', function (req, res, next) {

    var email = req.body.email.toLowerCase();
    async.waterfall([

        function (done) {
          crypto.randomBytes(25, function (err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function (token, done) {
          User.findOne({
            'local.email': email
          }, function (err, user) {
            if (err) {
              req.flash('error', "Error");
            }
            if (!user) {
              req.flash('error', "User with this email not found");
              return res.redirect('/forgotPassword');
            }
            user.resetPassword.token = token;
            user.resetPassword.ExpiredDate = Date.now() + 360000;

            user.save(function (err) {
              done(err, token, user);
            });
          });
        },
        function (token, user, done) {
          var transport = nodemailer.createTransport();
          var mailOptions = {
            from: 'Reset password < passwordreset@lgerp.com>',
            to: user.local.email,
            subject: 'Gate Keeper Contol password reset',
            text: 'You are receive this message because you or someone else' +
              ' have request the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste it into your browser to complete the process: \n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email'
          };
          transport.sendMail(mailOptions, function (err) {
            req.flash('success', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
            done(err, 'done');
          });
        }
      ],
      function (err) {
        if (err) return next(err);
        res.redirect('/forgotPassword');
      }
    );
  });
}