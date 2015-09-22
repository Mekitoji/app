var routesFunction = require('../../libs/routesFunction');

module.exports = function(app) {
  app.get('/tools/rate', function(req, res) {
    res.render('rate.ejs', {
      user: req.user,
      path: req.path
    });
  });
};