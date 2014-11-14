var routesFunction = require('../../libs/routesFunction');

module.exports = function (app) {
  app.get('/region', function (req, res) {
    res.render('region.ejs', {
      user: req.user
    });
  });
};