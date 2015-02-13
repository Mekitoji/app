var routesFunction = require('../../libs/routesFunction');
module.exports = function (app) {
  app.get('/tools/testers', routesFunction.checkPermissionRoot, function (req, res) {
    res.locals.path = req.path;
    res.render('testerTool.ejs', {
      user: req.user
    });
  });
}