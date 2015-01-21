var routesFunction = require('../../libs/routesFunction');
module.exports = function (app) {
  app.get('/tools/testers/newEU', routesFunction.checkPermissionGkEU, function (req, res) {
    res.locals.path = req.path;
    res.render('newTester.ejs', {
      user: req.user, // get the user out of session and pass to template
    });
  });
}