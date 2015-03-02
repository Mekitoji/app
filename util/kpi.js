var mongoose = require('../libs/mongoose');
var Apps = require('../models/CIS/gkbase');
var ApprovedApps = require('../models/CIS/gkbaseApproved');
var Calendar = require('../models/CIS/calendar');
var ApprovedCalendar = require('../models/CIS/calendarForApprovedApps');
var async = require('async');
var testerStat = require('../models/CIS/testerStat');
var _ = require('lodash');

var countReplyTime = function(storage) {
  var justL = 0,
    withHiddenL = 0,
    replyTime = 0;
  for (var i = 0; i < storage.length; i++) {
    if (storage[i].value === 'L' || storage[i].value === 'LL') {
      withHiddenL++;
    }
    if (storage[i].value === 'L') {
      justL++;
    }
  }
  replyTime = withHiddenL / justL;
  if (replyTime === Infinity || isNaN(replyTime)) {
    replyTime = 0;
  }
  return replyTime;
};


async.waterfall([

  function(cb) {
    Apps.find({})
      .exec(function(err, apps) {
        if (err) {
          console.log("gate 1 screw up");
          cb(err);
        }
        cb(null, apps);
      });
  },
  function(apps, cb) {
    _.forEach(apps, function(n, key) {
      Calendar.findOne({
        "appId": n._id
      })

      .exec(function(err, cal) {
        if (err) {
          console.log("gate 2 screw up");
          cb(err);
        }
        if (cal !== null && cal.storage.length !== 0) {
          cal = cal.toObject();
          n = n.toObject();
          cal.n = n;
          cal.storage = _.forEach(cal.storage, function(j) {
            if (j.value === undefined) {
              delete j;
            }
            if (j._id !== null) {
              delete j["_id"];
            }
          });
          cb(null, cal);
        } else if (cal === null) {
          //make request to approved collection
        }
      })
    });
  },
  function(cal, cb) {
    testerStat.findOne({
      "name": cal.n.resp
    })

    .exec(function(err, tester) {
      if (err) {
        console.log("gate 3 screw up");
        cb(err);
      }
      tester.appStorage = _.forEach(tester.appStorage, function(d, key) {
        if (d.app.toString() === cal.n._id.toString()) {
          d.respStorage = cal.storage;
          d.respTime = countReplyTime(d.respStorage);
        }
      });
      // console.log(tester.appStorage);
      tester.markModified("appStorage");
      tester.save();
      cb(null, tester);
    });
  }
], function(err, result) {
  if (err) return console.error(err);
  console.log(result);
})