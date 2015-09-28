var routesFunction = require('../../libs/routesFunction');

module.exports = function(app) {
  app.get('/:year/rate', function(req, res) {
    res.render('rate.ejs', {
      user: req.user,
      path: req.path
    });
  });
};