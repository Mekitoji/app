var routesFunction = require('../../../libs/routesFunction');
var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../../../models/user');
var History = require('../../../models/EU/history');
var _ = require('lodash');

module.exports = function (app) {
  app.get('/eu/history/:date/tester', routesFunction.checkPermissionGkEU, function (req, res) {
    var date = req.params.date;
    var title = "[" + date + "]" + "Gate Keeper Control History";
    var fDate = new Date(date);
    var nextDay = new Date(date);
    nextDay.setDate(fDate.getDate() + 1);

    History.findOne({
      date: {
        '$gte': fDate,
        '$lt': nextDay
      }
    })

    .exec(function (err, data) {
      if (err) res.send(err);
      // res.locals.testers = data.testerStat;
      // res.locals.path = req.path;
      // res.local.apps = data.apps;
      if (data === null) {
        res.json({
          "Error": "Data not found. Please try to change date"
        });
      } else {
        data.testerStat = _.forEach(data.testerStat, function (n, key) {
          User.findById(n.user)

          .exec(function (err, user) {
            if (err) res.send(err);
            n.user = user;
          });
          n.appStorage = _.forEach(n.appStorage, function (m, d) {
            m.app = _.where(data.apps, {
              "_id": m.app
            })[0];
          });
        });

        setTimeout(function () {
          res.render('history/testerList', {
            user: req.user,
            date: date,
            testers: data.testerStat,
            path: req.path,
            apps: data.apps
          });
        }, 500);
      }
    });
  });

  app.get('/eu/history/:date/tester/:tester_id', routesFunction.checkPermissionGkEU, function (req, res) {
    var date = req.params.date;
    var testerId = req.params.tester_id;
    var title = "[" + date + "]" + "Gate Keeper Control History";
    var fDate = new Date(date);
    var nextDay = new Date(date);
    var title = "[" + date + "]" + "Gate Keeper Control History";
    nextDay.setDate(fDate.getDate() + 1);

    History.findOne({
      date: {
        '$gte': fDate,
        '$lt': nextDay
      }
    })

    .exec(function (err, data) {
      if (err) res.send(err);
      if (data === null) {
        res.json({
          "Error": "Data not found. Please try to change date"
        });
      } else {

        data.testerStat = _.forEach(data.testerStat, function (n, key) {

          User.findById(n.user)

          .exec(function (err, user) {
            if (err) res.send(err);
            n.user = user;
          });

          n.appStorage = _.forEach(n.appStorage, function (m, d) {
            m.app = _.where(data.apps, {
              "_id": m.app
            })[0];
          });
        });
        data.testerStat = _.find(data.testerStat, function (stat) {
          // console.log(stat);
          return stat._id == testerId;
        });

        // console.log(data);
        setTimeout(function () {
          res.render('history/testerProfile', {
            user: req.user,
            date: date,
            title: title,
            path: req.path,
            apps: data.apps,
            tester: data.testerStat
          });
        }, 500)
      }
    });
  });
}