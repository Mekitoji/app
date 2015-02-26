var mongoose = require("../libs/mongoose");
var Apps = require('../models/CIS/gkbase');
var Calendar = require('../models/CIS/calendar');
var ApprovedCalendar = require('../models/CIS/calendarForApprovedApps');
var _ = require('lodash');
var stdin = process.stdin;
var ObjectId = require('mongoose').Types.ObjectId;
var testerStat = require('../models/CIS/testerStat');


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
              if (res !== null) {
                if (res.storage.length !== 0) {
                  //TODO
                  testerStat.find({
                    "name": responsePerson
                  })
                    .exec(function (err, stat) {
                      if (err) throw err;
                      console.log(stat);
                      console.log("Gate one open")
                    });
                  console.log(res.storage);
                } else {
                  //if len (res.storage) ===0 skip it
                }
              }
            });
          } else if (res.storage.length !== 0) {
            //if res.storage !==0 let add  and check it to kpi
            console.log(res.storage);

          } else {
            //if len(res.storage) === 0 skip it
            console.log("skip")
          }

        });
    });

  });