var routesFunction = require('../../../libs/routesFunction');
var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../../../models/user');
var History = require('../../../models/CIS/history');

module.exports = function (app) {
  app.get('/cis/history/:date/tester', routesFunction.checkPermissionGkCIS, function (req, res) {
    var date = req.params.date;
    var title = "[" + date + "]" + "Gate Keeper Control History";
    History.find({})

    .exec(function (err, data) {
      if (err) res.send(err);
      // res.locals.testers = data.testerStat;
      // res.locals.path = req.path;
      // res.local.apps = data.apps;
      res.render('history/testerList', {
        user: req.user,
        date: date,
        testers: data.testerStat,
        path: req.path,
        apps: data.apps
      });
    });
  });

  app.get('/cis/history/:date/tester/:tester_id', routesFunction.checkPermissionGkCIS, function (req, res) {
    var date = req.params.date;
    var title = "[" + date + "]" + "Gate Keeper Control History";
    History.find()

    .exec(function (err, data) {
      if (err) res.send(err);
      res.render('history/testerProfile', {
        user: req.user,
        date: date,
        title: title,
        path: req.path,
        apps: data.apps,
        testers: data.testerStat
      });
    });
  });
}