var _ = require('underscore');
var Apps = require('../models/gkbase');
var approvedApps = require('../models/gkbaseApproved');
var Cal = require('../models/calendar');
var log = require('../libs/log');


module.exports = function (app) {
  app.post('/getJson', function (req, res) {
    var headerArr = ['empty', 'appId', 'region', 'categoty', 'appName', 'seller', 'usagePeriod', 'updateDate', 'gk', 'appStatus', 'gkReview'];
    var headerArr2 = ['appId', 'appVer', 'Categoty', 'FileType', 'appName', 'country', 'price', 'updateDate', 'appStatus', 'gkReview', 'addTest'];
    var tempArr = [];
    //req.body.data
    console.log(req.body);

    if (req.body.table_caption === 'QA Request Mgt. List') {
      var objectX = JSON.parse(req.body.data);

      _.each(objectX, function (arr) {
        tempArr.push(_.object(headerArr, arr));
      });
      console.log(tempArr);
      _.each(tempArr, function (obj, num) {

        Apps.find({
          applicationId: obj.appId,
        }, function (err, data) {
          if (err) res.send(err);
          if (data.length === 0) {
            approvedApps.findOne({
              applicationId: obj.appId
            }, function (err, dataA) {
              if (dataA) {
                if (obj.appStatus !== 'App QA approved') {
                  Apps.create({
                    appName: obj.appName,
                    seller: obj.seller,
                    sdpStatus: obj.appStatus,
                    testCycles: 1,
                    replyTime: 0,
                    applicationId: obj.appId
                  }, function (err, app) {
                    if (err) res.send(err);
                    Apps.find({
                      applicationId: obj.appId
                    }, function (err, app) {
                      if (err) res.send(err);

                      // create Calendar data with this appName
                      var cal = new Cal({
                        appId: app[0]._id
                      });
                      cal.save(function (err, data) {
                        if (err) res.send(err);
                        res.json(data);
                        log.info(new Date() + '  - POST /API/GK/' + data.appId);
                      });
                    });
                  });
                } else {

                }
              } else {
                Apps.create({
                  appName: obj.appName,
                  seller: obj.seller,
                  sdpStatus: obj.appStatus,
                  testCycles: 1,
                  replyTime: 0,
                  applicationId: obj.appId
                }, function (err, app) {
                  if (err) res.send(err);
                  Apps.find({
                    applicationId: obj.appId
                  }, function (err, app) {
                    if (err) res.send(err);

                    // create Calendar data with this appName
                    var cal = new Cal({
                      appId: app[0]._id
                    });
                    cal.save(function (err, data) {
                      if (err) res.send(err);
                      res.json(data);
                      log.info(new Date() + '  - POST /API/GK/' + data.appId);
                    });
                  });
                });
              }
            });


            console.log(data);
          } else {
            /********************************NEED CHECK IT********************************/
            Apps.findOne({
              applicationId: obj.appId
            }, function (err, app) {
              if (err) res.send(err);
              //put some data for update here
              app.appName = obj.appName;
              app.sdpStatus = obj.appStatus;
              app.seller = obj.seller;
              app.applicationId = obj.appId;
              // save the bear
              app.save(function (err) {
                if (err)
                  res.send(err);
                res.json(app);
              });
            });
          }
        });
      });


    } else if (req.body.table_caption === 'QA Request Mgmt') {
      var objectY = JSON.parse(req.body.data);

      _.each(objectY, function (arr) {
        tempArr.push(_.object(headerArr2, arr));
        // console.log(_.object(headerArr2, arr));
      });
      // console.log(tempArr);
      _.each(tempArr, function (obj, num) {
        // console.log(obj.appName);
        // console.log(obj);
        /********************************NEED CHECK IT********************************/
        Apps.findOne({
            applicationId: obj.appId
          },
          function (err, app) {
            if (err) res.send(err);
            // console.log(app);
            //put some data for update here
            // app.appName = obj.appName;
            // app.sdpStatus = obj.sdpStatus;
            var reg = /.+\((.+)\)/;
            if (app === null) {
              // console.log(obj.appId);

              return false;
            }
            console.log(reg.exec(obj.country)[1]);
            console.log(new Date(obj.updateDate));
            // console.log(obj.appId);

            app.country = reg.exec(obj.country)[1];
            app.updateTime = new Date(obj.updateDate);

            app.save(function (err) {
              if (err)
                res.send(err);
              res.json(app);
            });

          });

      });


    }

    if (true) {
      res.json({
        "result": true
      });
    }
  });
};