var routesFunction = require('../../../libs/routesFunction');

module.exports = function (app) {
  app.get('/cis/history/:date/main', routesFunction.checkPermissionGkCIS, function (req, res) {
    var date = req.params.date;
    var title = "[" + date + "]" + "Gate Keeper Control History";
    res.locals.path = req.path;
    res.render('history/main', {
      title: title,
      user: req.user,
      date: date
    });
  });
};