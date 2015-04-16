var routesFunction = require('../../../libs/routesFunction');

module.exports = function (app) {
  app.get('/sia/history/:date/main', routesFunction.checkPermissionGkSIA, function (req, res) {
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

  app.get('/sia/history/:date/approved', routesFunction.checkPermissionGkSIA, function (req, res) {
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

  app.get('/sia/history/:date/rejected', routesFunction.checkPermissionGkSIA, function (req, res) {
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

  app.get('/sia/history/:date/outdated', routesFunction.checkPermissionGkSIA, function (req, res) {
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

  app.get('/sia/history/:date/notReviewed', routesFunction.checkPermissionGkSIA, function (req, res) {
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