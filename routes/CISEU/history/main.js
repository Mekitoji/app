var routesFunction = require('../../../libs/routesFunction');

module.exports = function (app) {
  app.get('/ciseu/history/:date/main', routesFunction.checkPermissionCISEU, function (req, res) {
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

  app.get('/ciseu/history/:date/approved', routesFunction.checkPermissionCISEU, function (req, res) {
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

  app.get('/ciseu/history/:date/rejected', routesFunction.checkPermissionCISEU, function (req, res) {
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

  app.get('/ciseu/history/:date/outdated', routesFunction.checkPermissionCISEU, function (req, res) {
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

  app.get('/ciseu/history/:date/notReviewed', routesFunction.checkPermissionCISEU, function (req, res) {
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
