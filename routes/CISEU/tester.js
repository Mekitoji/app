var routesFunction = require('../../libs/routesFunction');

module.exports = function (app) {
  app.get('/ciseu/:year/testCycle', routesFunction.checkPermissionCISEU, function (req, res) {
    res.locals.path = req.path;
    res.locals.year = req.params.year;
    res.render('testCycle.ejs', {
      user: req.user, // get the user out of session and pass to template
    });
  });
}
