var routesFunction = require('../../libs/routesFunction');

// SIGNUP =================================
// show the signup form

module.exports = function (app, passport) {
  app.get('/signup', routesFunction.alreadyLoginIn, function (req, res) {
    res.locals.path = req.path;
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
};