var routesFunction = require('../../libs/routesFunction');

module.exports = function (app) {
  app.get('/history', function (req, res) {
    res.render('history', {
      user: req.user,
      path: req.path
    });
  });
}