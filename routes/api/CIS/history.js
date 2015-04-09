var historyCIS = require('../../../models/CIS/history');
// var historyEU = require('../../../models/EU/history');
// var historySIA = require('../../../models/SIA/history');
// var historySandbox = require('../../../models/Sandbox/history');
var User = require('../../../models/user');
var _ = require('lodash');
var async = require('async');

module.exports = function (app) {
  app.get('/api/cis/history', function (req, res) {
    historyCIS.find()
      .exec(function (err, apps) {
        if (err) throw err;
        res.json(apps);
      });
  });

  app.get('/api/cis/history/:date', function (req, res) {
    var date = req.params.date;
    var fDate = new Date(date);
    var nextDay = new Date(date);
    nextDay.setDate(fDate.getDate() + 1);

    historyCIS.findOne({
      date: {
        '$gte': fDate,
        '$lt': nextDay
      }
    })

    .exec(function (err, data) {
      if (err) res.send(err);
      if (data === null) {
        res.send({
          "Error": "Date not found"
        });
      } else {
        data.calendar = _.forEach(data.calendar, function (n, key) {
          n.appId = _.where(data.apps, {
            "_id": n.appId
          })[0];
        });

        data.approvedCalendar = _.forEach(data.approvedCalendar, function (n, key) {
          n.appId = _.where(data.approvedApps, {
            "_id": n.appId
          })[0];
        });

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
        data.apps = _.where(data.apps, {
          "tv": "In Progress"
        });
        res.json(data);
      }
    });
  });


  app.get('/api/cis/history/:date/rejected', function (req, res) {
    var date = req.params.date;
    var fDate = new Date(date);
    var nextDay = new Date(date);
    nextDay.setDate(fDate.getDate() + 1);
    historyCIS.findOne({
      date: {
        '$gte': fDate,
        '$lt': nextDay
      }
    })

    .exec(function (err, data) {
      if (err) throw err;
      if (data === null) {
        res.send({
          "Error": "Date not found"
        });
      } else {
        data.calendar = _.forEach(data.calendar, function (n, key) {
          n.appId = _.where(data.apps, {
            "_id": n.appId,
            "tv": "In Progress",
            "outdated": false
          })[0];
          if (typeof n.appId !== "object") {
            delete data.calendar[key];
          }
        });
        data.approvedCalendar = _.forEach(data.approvedCalendar, function (n, key) {
          n.appId = _.where(data.approvedApps, {
            "_id": n.appId
          })[0];
        });
        data.apps = _.where(data.apps, {
          "tv": "In Progress",
          "outdated": false
        })
        res.json(data);
      }
    });
  });

  app.get('/api/cis/history/:date/notReviewed', function (req, res) {
    var date = req.params.date;
    var fDate = new Date(date);
    var nextDay = new Date(date);
    nextDay.setDate(fDate.getDate() + 1);
    historyCIS.findOne({
      date: {
        '$gte': fDate,
        '$lt': nextDay
      }
    })

    .exec(function (err, data) {
      if (err) throw err;
      if (data === null) {
        res.send({
          "Error": "Date not found"
        });
      } else {
        data.calendar = _.forEach(data.calendar, function (n, key) {
          n.appId = _.where(data.apps, {
            "_id": n.appId
          })[0];
        });

        data.approvedCalendar = _.forEach(data.approvedCalendar, function (n, key) {
          n.appId = _.where(data.approvedApps, {
            "_id": n.appId
          })[0];
        });
        data.apps = _.where(data.apps, {
          "tv": "Not Reviewed"
        })
        res.json(data);
      }
    });
  });

  app.get('/api/cis/history/:date/outdated', function (req, res) {
    var date = req.params.date;
    var fDate = new Date(date);
    var nextDay = new Date(date);
    nextDay.setDate(fDate.getDate() + 1);
    historyCIS.findOne({
      date: {
        '$gte': fDate,
        '$lt': nextDay
      }
    })

    .exec(function (err, data) {
      if (err) throw err;
      if (data === null) {
        res.send({
          "Error": "Date not found"
        });
      } else {
        data.calendar = _.forEach(data.calendar, function (n, key) {
          n.appId = _.where(data.apps, {
            "_id": n.appId,
            "outdated": true
          })[0];
          if (typeof n.appId !== "object") {
            delete data.calendar[key];
          }
        });

        data.approvedCalendar = _.forEach(data.approvedCalendar, function (n, key) {
          n.appId = _.where(data.approvedApps, {
            "_id": n.appId
          })[0];
        });
        data.apps = _.where(data.apps, {
          "outdated": true
        })
        res.json(data);
      }
    });
  });


}