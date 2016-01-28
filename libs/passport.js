var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function (req, email, password, done) {
      if (email) {
        email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
      }
      process.nextTick(function () {
        User.findOne({
          'local.email': email
        }, function (err, user) {
          // if there are any errors, return the error
          if (err) {
            return done(err);
          }
          // if no user is found, return the message
          if (!user) {
            return done(null, false, req.flash('loginMessage', 'User not found.'));
          }
          if (!user.validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
          }
          // all is well, return user
          else
            return done(null, user);
        });
      });
    }));
  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function (req, email, password, done) {
      if (email)
        email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
      process.nextTick(function () {
        // if the user is not already logged in:
        if (!req.user) {
          User.findOne({
            'local.email': email
          }, function (err, user) {
            // if there are any errors, return the error
            if (err)
              return done(err);
            // check to see if theres already a user with that email
            if (user) {
              return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else if (/[^\w\d.@!#$%&'*+-/=?^_`{|}~]+/gi.test(email) || email.length < 4 || email.length > 254) {
              return done(null, false, req.flash('signupMessage', 'Please enter valid email.'));
            } else if (password.length < 6) {
              return done(null, false, req.flash('signupMessage', 'Password must contain more then 5 symbols'));
            } else if (/[\/\s\\@$%&*+=-]+/gi.test(password)) {
              return done(null, false, req.flash('signupMessage', 'Please does not use /\\@$%&*+=- symbols and space in password'));
            } else if (password !== req.body['repeat-password']) {
              return done(null, false, req.flash('signupMessage', 'Password do not match'));
            } else if (/[^\w]+/gi.test(req.body.firstName) || /[^\w]+/gi.test(req.body.lastName)) {
              return done(null, false, req.flash('signupMessage', 'Please use only latin letters in name'));
            } else {
              // create the user
              var newUser = new User();
              newUser.local.email = email;
              newUser.local.username.first = req.body.firstName;
              newUser.local.username.last = req.body.lastName;
              newUser.local.password = newUser.generateHash(password);
              newUser.save(function (err) {
                if (err)
                  throw err;
                return done(null, newUser);
              });
            }
          });
          // if the user is logged in but has no local account...
        } else if (!req.user.local.email) {
          // ...presumably they're trying to connect a local account
          var user = req.user;
          user.local.email = email;
          user.local.password = user.generateHash(password);
          user.save(function (err) {
            if (err)
              throw err;
            return done(null, user);
          });
        } else {
          // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
          return done(null, req.user);
        }
      });
    }));
};
