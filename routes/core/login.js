var routesFunction = require('../../libs/routesFunction');

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
module.exports = function (app, passport) {

  app.get('/login', routesFunction.alreadyLoginIn, function (req, res) {
    res.locals.path = req.path;
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });
  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/region', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));
};