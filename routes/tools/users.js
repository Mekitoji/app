var routesFunction = require('../../libs/routesFunction');

module.exports = function (app) {
  app.get('/tools/users', routesFunction.checkPermissionRoot, function (req, res) {
    res.render('users.ejs', {
      user: req.user,
    });
  });
};