var _ = require('lodash');
var Apps = require('../../models/CIS/gkbase');
var AppsEU = require('../../models/EU/gkbase');
var AppsSandbox = require('../../models/Sandbox/gkbase');
var approvedApps = require('../../models/CIS/gkbaseApproved');
var approvedAppsEU = require('../../models/EU/gkbaseApproved');
var approvedAppsSandbox = require('../../models/Sandbox/gkbaseApproved');
var Cal = require('../../models/CIS/calendar');
var CalEU = require('../../models/EU/calendar');
var CalSandbox = require('../../models/Sandbox/calendar');
var log = require('../../libs/log');

module.exports = function (app) {
  app.post('/api/getJson', function (req, res) {
    // console.log(req.body.data);
    // console.log(req.body.table_caption);
    // console.log(req.body.region);
    var headerArr = ['empty', 'appId', 'region', 'gk', 'appName', 'seller', 'updateDate', 'appStatus', 'gkReview'];
    var tempArr = [];

    if (req.body.region === "CS" && req.body.table_caption === "Gate Keeper Review List") {
      var objectX = JSON.parse(req.body.data);

      _.forEach(objectX, function (arr) {
        tempArr.push(_.zipObject(headerArr, arr));
      });
      _.forEach(tempArr, function (n, key) {
        console.log(n);
        Apps.findOne({
          applicationId: n.appId
        })

        .exec(function (err, app) {
          if (err) {
            res.json({
              "result": false,
              "data": err
            });
          };

          if (app === null && n.appStatus !== "App QA approved") {
            Apps.create({
              appName: n.appName,
              seller: n.seller,
              sdpStatus: n.appStatus,
              tv: 'In Progress',
              testCycles: 1,
              updateTime: n.updateDate,
              replyTime: 0,
              applicationId: n.appId
            });

            Apps.save()

            .exec(function (err, resultA) {
              if (err) {
                res.json({
                  "result": false,
                  "data": err
                });
              }
              Cal.create({
                appId: resultA._id
              });
              Cal.save(function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          } else if (app !== null) {
            Apps.findOne({
              applicationId: n.appId
            })

            .exec(function (err, app) {
              if (err) {
                res.json({
                  "result": false,
                  data: err
                })
              }

              n.updateDate = new Date(n.updateDate);
              app.sdpStatus = n.appStatus;
              app.updateTime = n.updateDate;
              app.save(function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          }
        })
      });

    } else if (req.body.region === "EU" && req.body.table_caption === "Gate Keeper Review List") {

      var objectX = JSON.parse(req.body.data);

      _.forEach(objectX, function (arr) {
        tempArr.push(_.zipObject(headerArr, arr));
      });
      _.forEach(tempArr, function (n, key) {
        AppsEU.findOne({
          applicationId: n.appId
        })

        .exec(function (err, app) {
          if (err) {
            res.json({
              "result": false,
              "data": err
            });
          };

          if (app === null && n.appStatus !== "App QA approved") {
            AppsEU.create({
              appName: n.appName,
              seller: n.seller,
              sdpStatus: n.appStatus,
              tv: 'In Progress',
              testCycles: 1,
              updateTime: n.updateDate,
              replyTime: 0,
              applicationId: n.appId
            })
            AppsEU.save()

            .exec(function (err, resultA) {
              if (err) {
                res.json({
                  "result": false,
                  "data": err
                });
              }
              CalEU.create({
                appId: resultA._id
              });
              CalEU.save(function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          } else if (app !== null) {
            AppsEU.findOne({
              applicationId: n.appId
            })

            .exec(function (err, app) {
              if (err) {
                res.json({
                  "result": false,
                  data: err
                })
              }

              n.updateDate = new Date(n.updateDate);
              app.sdpStatus = n.appStatus;
              app.updateTime = n.updateDate;
              app.save(function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          }
        })
      });
    } else if (req.body.region === "all" && req.body.table_caption === "Gate Keeper Review List") {

      var objectX = JSON.parse(req.body.data);

      _.forEach(objectX, function (arr) {
        tempArr.push(_.zipObject(headerArr, arr));
      });
      _.forEach(tempArr, function (n, key) {
        AppsSandbox.findOne({
          applicationId: n.appId
        })

        .exec(function (err, app) {
          if (err) {
            res.json({
              "result": false,
              "data": err
            });
          };

          if (app === null && n.appStatus !== "App QA approved") {
            AppsSandbox.create({
              appName: n.appName,
              seller: n.seller,
              sdpStatus: n.appStatus,
              tv: 'In Progress',
              testCycles: 1,
              updateTime: n.updateDate,
              replyTime: 0,
              applicationId: n.appId
            });

            AppsSandbox.save()

            .exec(function (err, resultA) {
              if (err) {
                res.json({
                  "result": false,
                  "data": err
                });
              }
              CalSandbox.create({
                appId: resultA._id
              });
              CalSandbox.save(function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          } else if (app !== null) {
            AppsSandbox.findOne({
              applicationId: n.appId
            })

            .exec(function (err, app) {
              if (err) {
                res.json({
                  "result": false,
                  data: err
                })
              }

              n.updateDate = new Date(n.updateDate);
              app.sdpStatus = n.appStatus;
              app.updateTime = n.updateDate;
              app.save(function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          }
        })
      });
    }

  });
}