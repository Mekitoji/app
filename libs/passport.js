/*//Local Strategy for auth
var LocalStrategy = require('passport-local').Strategy;

//load the user model
var User = require('../models/user');

var LocalPassport = function(passport) {
  //passport session setup

  //used to serialize the user for the session 
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //used to deserialize th user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //Local login

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true //allows us to pass in the req from our route(lets us check if a user is logged on or not)
    },
    function(req, email, password, done) {
      if (email) {
        email = email.toLowerCase();
      }

      process.nextTick(function() {
        User.findOne({
          'email': email
        }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, req.flash('loginMessage', 'No user found'));
          }
          if (!user.checkPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Wrong password'));
          } else {
            return done(null, user);
          }

        });
      });
    }));
  //local signup

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      firstNameField: 'firstName',
      LastNamefield: 'lastName',
      passReqToCallback: true
    },
    function(req, email, password, firstName, lastName, done) {
      if (email) {
        email = email.toLowerCase();
        process.nextTick(function() {
          if (!req.user) {
            User.findOne({
              'email': email
            }, function(err, user) {
              if (err) {
                return done(err);
              }
              if (user) {
                return done(null, false, req.flash('sugnupMessage', 'That email is already taken'));
              } else {
                var newUser = new User();

                newUser.email = email;
                newUser.password = password; //!!!!!!!!!!!
                newUser.name.first = firstName;
                newUser.name.last = lastName;
                newUser.save(function(err) {
                  if (err)
                    throw err;

                  return done(null, newUser);
                });
              }

            });
          } else if (!req.user.email) {
            var user = req.user;
            user.email = email;
            user.password = password //!!!!!!!

            user.save(function(err) {
              if (err) {
                throw err
              }
              return done(null, user);
            });
          } else {
            return done(null, req.user);
          }
        });
      }
    }));
};

module.exports = LocalPassport;*/

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../models/user');


module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
      if (email)
        email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

      // asynchronous
      process.nextTick(function() {
        User.findOne({
          'local.email': email
        }, function(err, user) {
          // if there are any errors, return the error
          if (err)
            return done(err);

          // if no user is found, return the message
          if (!user)
            return done(null, false, req.flash('loginMessage', 'No user found.'));

          if (!user.validPassword(password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

          // all is well, return user
          else
            return done(null, user);
        });
      });

    }));

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
      if (email)
        email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

      // asynchronous
      process.nextTick(function() {
        // if the user is not already logged in:
        if (!req.user) {
          User.findOne({
            'local.email': email
          }, function(err, user) {
            // if there are any errors, return the error
            if (err)
              return done(err);

            // check to see if theres already a user with that email
            if (user) {
              return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

              // create the user
              var newUser = new User();
              newUser.local.email = email;
              newUser.local.username.first = req.body.firstName
              newUser.local.username.last = req.body.lastName;
              newUser.local.password = newUser.generateHash(password);

              newUser.save(function(err) {
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
          user.save(function(err) {
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