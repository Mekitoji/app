var history = require('../models/SIA/history');
var Apps = require('../models/SIA/gkbase');
var ApprovedApps = require('../models/SIA/gkbaseApproved');
var Calendar = require('../models/SIA/calendar');
var ApprovedCalendar = require('../models/SIA/calendarForApprovedApps');
var testerStat = require('../models/SIA/testerStat');
var async = require('async');

var temp = {};

async.waterfall([

  function (cb) {
    Apps.find({})

    .exec(function (err, apps) {
      if (err) cb(err);
      temp.apps = apps;
      cb(null, temp);
    });
  },
  function (temp, cb) {
    ApprovedApps.find({})

    .exec(function (err, appsA) {
      if (err) cb(err);
      temp.approvedApps = appsA;
      cb(null, temp);
    });
  },
  function (temp, cb) {
    Calendar.find({})

    .exec(function (err, cal) {
      if (err) cb(err);
      temp.calendar = cal;
      cb(null, temp);
    });
  },
  function (temp, cb) {
    ApprovedCalendar.find({})

    .exec(function (err, calA) {
      if (err) cb(err);
      temp.approvedCalendar = calA;
      cb(null, temp);
    });
  },
  function (temp, cb) {

    testerStat.find({})

    .exec(function (err, stats) {
      if (err) cb(err);
      temp.testerStat = stats;
      cb(null, temp);
    });
  }
], function (err, result) {
  if (err) throw err;
  history.create({
    apps: temp.apps,
    calendar: temp.calendar,
    approvedApps: temp.approvedApps,
    approvedCalendar: temp.approvedCalendar,
    testerStat: temp.testerStat
  });
  setTimeout(function () {
    process.exit()
  }, 0);
});