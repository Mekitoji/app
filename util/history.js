var historyCIS = require('../models/CIS/history');
var Apps = require('../models/CIS/gkbase');
var ApprovedApps = require('../models/CIS/gkbaseApproved');
var Calendar = require('../models/CIS/calendar');
var ApprovedCalendar = require('../models/CIS/calendarForApprovedApps');
var testerStat = require('../models/CIS/testerStat');
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
  historyCIS.create({
    apps: temp.apps,
    calendar: temp.calendar,
    approvedApps: temp.approvedApps,
    approvedCalendar: temp.approvedCalendar,
    testerStat: temp.testerStat
  });
});


// Apps.find({})

// .exec(function (err, apps) {
//   historyCIS.create({
//     apps: apps
//   }, function (err, history) {
//     if (err) throw err;
//     history.approvedApps = ["hey"];
//     history.calendar = ["hey"];
//     history.ApprovedCalendar = ["hey"];
//     history.testerStat = ["hey"];
//     history.markModified('approvedApps');
//     history.markModified('calendar');
//     history.markModified('ApprovedCalendar');
//     history.markModified('testerStat');
//     history.save(function (err) {
//       if (err) throw err;
//     })
//   });
// });