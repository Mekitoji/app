var routesFunction = require('../libs/routesFunction');
// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the redirectMain function)

module.exports = function (app) {
  app.get('/profile', routesFunction.checkPermission, function (req, res) {
    res.render('profile.ejs', {
      user: req.user // get the user out of session and pass to template
    });
  });
};