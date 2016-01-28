var routesFunction = require('../../libs/routesFunction');
module.exports = function (app) {
  app.get('/tools/testers/newCISEU', routesFunction.checkPermissionGkCISEU, function (req, res) {
    res.locals.path = req.path;
    res.render('newTester.ejs', {
      user: req.user, // get the user out of session and pass to template
    });
  });
}
