var routesFunction = require('../../../libs/routesFunction');

module.exports = function (app) {
  app.get('/cis/history/:date/main', routesFunction.checkPermissionCIS, function (req, res) {
    var date = req.params.date;
    //date = mm-dd-yy
    var title = "[" + date + "]" + "Gate Keeper Control History";
    res.locals.path = req.path;
    res.render('history/main', {
      title: title,
      user: req.user,
      date: date
    });
  });

  app.get('/cis/history/:date/approved', routesFunction.checkPermissionCIS, function (req, res) {
    var date = req.params.date;
    //date = mm-dd-yy
    var title = "[" + date + "]" + "Gate Keeper Control History - Approved";
    res.locals.path = req.path;
    res.render('history/main', {
      title: title,
      user: req.user,
      date: date
    });
  });

  app.get('/cis/history/:date/rejected', routesFunction.checkPermissionCIS, function (req, res) {
    var date = req.params.date;
    //date = mm-dd-yy
    var title = "[" + date + "]" + "Gate Keeper Control History - In Progress";
    res.locals.path = req.path;
    res.render('history/main', {
      title: title,
      user: req.user,
      date: date
    });
  });

  app.get('/cis/history/:date/outdated', routesFunction.checkPermissionCIS, function (req, res) {
    var date = req.params.date;
    //date = mm-dd-yy
    var title = "[" + date + "]" + "Gate Keeper Control History - Outdated";
    res.locals.path = req.path;
    res.render('history/main', {
      title: title,
      user: req.user,
      date: date
    });
  });

  app.get('/cis/history/:date/notReviewed', routesFunction.checkPermissionCIS, function (req, res) {
    var date = req.params.date;
    //date = mm-dd-yy
    var title = "[" + date + "]" + "Gate Keeper Control History - Not Reviewed";
    res.locals.path = req.path;
    res.render('history/main', {
      title: title,
      user: req.user,
      date: date
    });
  });
};