var routesFunction = require('../../libs/routesFunction');

module.exports = function (app) {
  app.get('/sia/:year/testCycle', routesFunction.checkPermissionSIA, function (req, res) {
    res.locals.path = req.path;
    res.locals.year = req.params.year;
    res.render('testCycle.ejs', {
      user: req.user, // get the user out of session and pass to template
    });
  });
}