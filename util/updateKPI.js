var mongoose = require("../libs/mongoose");
var Apps = require('../models/CIS/gkbase');
var Calendar = require('../models/CIS/calendar');
var ApprovedCalendar = require('../models/CIS/calendarForApprovedApps');
var _ = require('lodash');
var stdin = process.stdin;
var ObjectId = require('mongoose').Types.ObjectId;
var testerStat = require('../models/CIS/testerStat');



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

var count = 0;
//make request, get all apps
Apps.find({})

.exec(function (err, apps) {
  if (err) throw err;

  _.forEach(apps, function (n, key) {
    var responsePerson = n.resp;
    Calendar.findOne({
      "appId": n._id
    })
      .exec(function (err, res) {
        if (err) throw err;
        // console.log(res);
        //if calendar in another collection(approved) res===null
        if (res === null) {
          ApprovedCalendar.findOne({
            "appId": n._id
          }, function (err, res) {
            if (err) throw err;
            // console.log(res);
            //if res.storage !==0 let add  and check it to kpi

            if (res !== null && res.storage) {
              if (res.storage.length !== 0) {
                //TODO
                testerStat.findOne({
                  "name": responsePerson
                })
                  .exec(function (err, stat) {

                    if (err) throw err;
                    var resStorage = countReplyTime(res.storage)
                    var date = new Date();
                    stat.appStorage.push({
                      app: new ObjectId(n._id),
                      year: date.getFullYear(),
                      testCycle: 1,
                      respTime: resStorage,
                      testCycleStorage: [],
                      respStorage: res.storage
                    });
                    //calculate here***********
                    stat.save(function (err, result) {
                      if (err) throw err;
                      console.log("New appStorage created for %s with \"%s\" app", responsePerson, n._id);
                    })
                  });

                // console.log(res.storage);
              } else {
                //if len (res.storage) ===0 skip it
              }
            }

          });

        } else if (responsePerson && res.storage && res.storage.length !== 0) {
          //if res.storage !==0 let add  and check it to kpi
          // console.log(res.storage);
          testerStat.findOne({
            "name": responsePerson
          })
            .exec(function (err, stat) {
              if (err) throw err;
              // console.log(stat.appStorage);
              _.forEach(stat.appStorage, function (appStorage) {
                if (appStorage.app === n._id) {
                  appStorage.respStorage = res.storage;
                  //calculate here**************
                  appStorage.respStorage = countReplyTime(res.storage);
                  stat.save(function (err, result) {
                    if (err) throw err;
                    console.log("[%s]App storage for %s was updated", responsePerson, n._id);
                  })
                }
              });
            });
        } else {
          //if len(res.storage) === 0 skip it
          console.log("skip ")
        }

      });
  });

});