var mongoose = require('../libs/mongoose');
var Apps = require('../models/CIS/gkbase');
var ApprovedApps = require('../models/CIS/gkbaseApproved');
var Calendar = require('../models/CIS/calendar');
var ApprovedCalendar = require('../models/CIS/calendarForApprovedApps');
var async = require('async');
var testerStat = require('../models/CIS/testerStat');
var ObjectId = require('mongoose').Types.ObjectId;
var _ = require('lodash');
var Promise = require('promise');
var count = 0;
var countUP = 0;

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

var countReplyTime = function (storage) {
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

    function (cb) {
      Apps.find({})
        .exec(function (err, apps) {
          if (err) {
            console.log("gate 1 screw up");
            cb(err);
          }
          cb(null, apps);
        });
    },
    function (apps, cb) {
      var tempCal = [];
      _.forEach(apps, function (n, key) {
        Calendar.findOne({
          "appId": n._id
        })

        .exec(function (err, cal) {
          if (err) {
            console.log("gate 2 screw up");
            cb(err);
          }
          if (cal !== null && cal.storage.length !== 0) {
            //null
          } else if (cal === null) {
            //make request to approved collection
            tempCal.push(n);
          }
        })
      });
      console.log("working...");
      setTimeout(function () {
        cb(null, tempCal);
      }, 5000);
    },
    function (tempCal, cb) {
      var temp = {};
      // console.log(tempCal);
      _.forEach(tempCal, function (c) {
        ApprovedCalendar.findOne({
          "appId": c._id
        })

        .exec(function (err, cal) {
          if (err) {
            console.log("gate 3 screw up")
            cb(err);
          }
          if (cal === null || cal.storage.length === 0) {
            console.log("Something go wrong here. App'll not be updated");
          } else {
            var resp = c.resp;
            cal = cal.toObject();
            c = c.toObject();
            cal.c = c;

            cal.storage = _.forEach(cal.storage, function (j) {
              if (j.value === undefined) {
                delete j;
              }
              if (j._id !== null) {
                delete j["_id"];
              }
            });
            if (temp[resp] !== null && temp[resp] !== undefined) {
              temp[resp].push(cal);
            } else {
              temp[resp] = [];
              temp[resp].push(cal);
            }
          }
        });
      });
      console.log("working...");
      setTimeout(function () {
        cb(null, temp);
      }, 5000);
    },
    function (temp, cb) {
      // console.log(temp);
      var respArray = [];
      _.forEach(temp, function (d, key) {
        respArray.push(key);
      });
      // console.log(respArray);

      async.map(respArray, function (resp) {
        testerStat.findOne({
          "name": resp
        })

        .exec(function (err, tester) {
          if (err) {
            console.log("gate 5 screw up");
            cb(err);
          }
          _.forEach(temp[resp], function (g) {
            var changed = false;

            _.forEach(tester.appStorage, function (x) {
              if (g.storage !== null && g.storage !== undefined) {
                if (x.app.toString() === g.c._id.toString()) {
                  console.log(true);
                  x.respStorage = g.storage;
                  x.respTime = countReplyTime(g.storage);
                  countUP++;
                  delete g.storage;
                }
              }
            });

            if (g.storage !== null && g.storage !== undefined) {
              var respTime = countReplyTime(g.storage);
              var date = new Date();
              tester.appStorage.push({ //app obj
                app: new ObjectId(g.appId), // get _id of mongo
                year: date.getFullYear(),
                testCycle: 1, //init testCycle 1
                respTime: respTime, //init with respTime 
                testCycleStorage: [], // init testCycle array for insert obj = {date: Date(), reason: String}
              })
              count++;
            }

          });
          cb(null, tester);
        });
      });
    }
  ],
  function (err, result) {
    if (err) return console.error(err);
    result.markModified("appStorage");
    result.save(function (err, res) {
      if (err) {
        console.error("Bull shit!");
      }
      // console.log(res);
    })
    process.stdin.on('data', function (key) {
      if (key) {
        process.stdout.write(count + " app was insert.\n");
        process.stdout.write(countUP + " storage was updated.\n");
        process.stdout.write("Goodbye!");
        process.exit();
      }
    });
  });