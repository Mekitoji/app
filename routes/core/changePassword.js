var routesFunction = require('../../libs/routesFunction');
var User = require('../../models/user');
var nodemailer = require('nodemailer');
var async = require('async');

module.exports = function (app) {
  app.get('/profile/changePassword', routesFunction.unAuth, function (req, res) {
    res.locals.path = req.path;
    res.render('changePassword', {
      user: req.user,
      success: req.flash('success'),
      error: req.flash('error')
    });
  });

  app.post('/profile/changePassword', function (req, res) {
    var id = req.user._id;
    var email = req.user.local.email;
    console.log(req.user);
    var username = req.user.local.username.first + ' ' + req.user.local.username.last;

    async.waterfall([

      function (done) {
        User.findById(id, function (err, user) {
          var oldPassword = req.body.oldPassword
          var newPassword = req.body.newPassword
          var confirm = req.body.confirm
          var changePassword = new User();
          if (err || !user) {
            req.flash('error', 'Server error');
            res.redirect('/profile/changePassword');
          }
          if (oldPassword.length === 0 || newPassword.length === 0 || confirm === 0) {
            req.flash('error', "Please fill all fields.");
            return res.redirect('/profile/changePassword');
          }
          if (!user.validPassword(oldPassword)) {
            req.flash('error', "Old password does not match.");
            return res.redirect('/profile/changePassword');
          }
          if (newPassword !== confirm) {
            req.flash('error', "New password does not match.");
            return res.redirect('/profile/changePassword');
          }
          if (newPassword.length < 6) {
            req.flash('error', "Please create password with more then 5 symbols.");
            return res.redirect('/profile/changePassword');
          }
          if (/[\/\s\\@$%&*+=-]/gi.test(newPassword)) {
            req.flash('error', "Please does not use /\\@$%&*+=- symbols");
            return res.redirect('/profile/changePassword');
          }
          user.local.password = changePassword.generateHash(newPassword);

          user.save(function (err) {
            done(err, user);
          });
        })
      },
      function (user, done) {
        var transport = nodemailer.createTransport();
        var mailOptions = {
          to: email,
          from: 'Change password < changepassword@lgerp.com>',
          subject: "Your password has been changed",
          text: 'Dear ' + username + ',\n\n' +
            'Password to your account: ' + email + ', has just been changed.\n'
        };
        transport.sendMail(mailOptions, function (err) {
          req.flash('success', 'Success! Your password has been changed!');
          done(err);
        });
      }
    ], function (err) {
      return res.redirect('/profile/changePassword');
    })
  });
}