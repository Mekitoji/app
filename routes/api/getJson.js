var _ = require('underscore');
var Apps = require('../../models/CIS/gkbase');
var AppsEU = require('../../models/EU/gkbase');
var approvedApps = require('../../models/CIS/gkbaseApproved');
var approvedAppsEU = require('../../models/EU/gkbaseApproved');
var Cal = require('../../models/CIS/calendar');
var CalEU = require('../../models/EU/calendar');
var log = require('../../libs/log');


module.exports = function (app) {
  app.post('/api/getJson', function (req, res) {
    var headerArr = ['empty', 'appId', 'region', 'categoty', 'appName', 'seller', 'usagePeriod', 'updateDate', 'gk', 'appStatus', 'gkReview'];
    var headerArr2 = ['appId', 'appVer', 'Categoty', 'FileType', 'appName', 'country', 'price', 'updateDate', 'appStatus', 'gkReview', 'addTest'];
    var tempArr = [];
    //req.body.data
    if (req.body.region === 'CS') {
      //check table caption
      if (req.body.table_caption === 'QA Request Mgt. List') {
        //parse incoming obj to json view
        var objectX = JSON.parse(req.body.data);

        _.each(objectX, function (arr) {
          tempArr.push(_.object(headerArr, arr));
        });
        _.each(tempArr, function (obj, num) {

          Apps.find({
            applicationId: obj.appId,
          }, function (err, data) {
            if (err) res.json({
              "result": err
            });
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
                      tv: 'In Progress',
                      testCycles: 1,
                      updateTime: obj.updateDate,
                      replyTime: 0,
                      applicationId: obj.appId
                    }, function (err, app) {
                      if (err) res.json({
                        "result": err
                      });
                      Apps.find({
                        applicationId: obj.appId
                      }, function (err, app) {
                        if (err) res.json({
                          "result": err
                        });

                        // create Calendar data with this appName
                        var cal = new Cal({
                          appId: app[0]._id
                        });
                        cal.save(function (err, data) {
                          if (err) res.send({
                            "result": err
                          });
                          res.json({
                            "result": true,
                            "data": data
                          });

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
                    tv: 'In Progress',
                    updateTime: obj.updateDate,
                    testCycles: 1,
                    replyTime: 0,
                    applicationId: obj.appId
                  }, function (err, app) {
                    if (err) res.json({
                      "result": err
                    });
                    Apps.find({
                      applicationId: obj.appId
                    }, function (err, app) {
                      if (err) res.json({
                        "result": err
                      });

                      // create Calendar data with this appName
                      var cal = new Cal({
                        appId: app[0]._id
                      });
                      cal.save(function (err, data) {
                        if (err) res.json({
                          "result": err
                        });
                        res.json({
                          "result": true,
                          "data": data
                        });
                        log.info(new Date() + '  - POST /API/GK/' + data.appId);
                      });
                    });
                  });
                }
              });


            } else {
              /********************************NEED CHECK IT********************************/
              Apps.findOne({
                applicationId: obj.appId
              }, function (err, app) {
                if (err) res.json({
                  "result": err
                });


                obj.updateDate = obj.updateDate.split(' ')[0];

                //put some data for update here
                app.appName = obj.appName;
                app.sdpStatus = obj.appStatus;
                app.seller = obj.seller;
                app.applicationId = obj.appId;
                app.updateTime = new Date(obj.updateDate);
                // save the bear
                app.save(function (err) {
                  if (err)
                    res.json({
                      "result": err
                    });
                  res.json({
                    "result": true,
                    "data": app
                  });
                });
              });
            }
          });
        });


      } else if (req.body.table_caption === 'QA Request Mgmt') {
        var objectY = JSON.parse(req.body.data);

        _.each(objectY, function (arr) {
          tempArr.push(_.object(headerArr2, arr));
        });
        _.each(tempArr, function (obj, num) {
          /********************************NEED CHECK IT********************************/
          Apps.findOne({
              applicationId: obj.appId
            },
            function (err, app) {
              if (err) res.json({
                "result": err
              });
              //put some data for update here
              // app.appName = obj.appName;
              // app.sdpStatus = obj.sdpStatus;
              var reg = /.+\((.+)\)/;
              if (app === null) {
                return false;
              }
              obj.updateDate = obj.updateDate.split(' ')[0];

              app.country = reg.exec(obj.country)[1];
              app.updateTime = new Date(obj.updateDate);

              app.save(function (err) {
                if (err)
                  res.json({
                    "result": err
                  });
                res.json({
                  "result": true,
                  "data": app
                });
              });

            });

        });


      }

    } else if (req.body.region === 'EU') {
      //check table caption
      if (req.body.table_caption === 'QA Request Mgt. List') {
        //parse incoming obj to json view
        var objectEU = JSON.parse(req.body.data);

        _.each(objectEU, function (arr) {
          tempArr.push(_.object(headerArr, arr));
        });
        _.each(tempArr, function (obj, num) {

          AppsEU.find({
            applicationId: obj.appId,
          }, function (err, data) {
            if (err) res.json({
              "result": err
            });
            if (data.length === 0) {
              approvedAppsEU.findOne({
                applicationId: obj.appId
              }, function (err, dataA) {
                if (dataA) {
                  if (obj.appStatus !== 'App QA approved') {
                    AppsEU.create({
                      appName: obj.appName,
                      seller: obj.seller,
                      sdpStatus: obj.appStatus,
                      tv: 'In Progress',
                      testCycles: 1,
                      updateTime: obj.updateDate,
                      replyTime: 0,
                      applicationId: obj.appId
                    }, function (err, app) {
                      if (err) res.json({
                        "result": err
                      });
                      AppsEU.find({
                        applicationId: obj.appId
                      }, function (err, app) {
                        if (err) res.json({
                          "result": err
                        });

                        // create Calendar data with this appName
                        var cal = new CalEU({
                          appId: app[0]._id
                        });
                        cal.save(function (err, data) {
                          if (err) res.send({
                            "result": err
                          });
                          res.json({
                            "result": true,
                            "data": data
                          });

                          log.info(new Date() + '  - POST /API/GK/' + data.appId);
                        });
                      });
                    });
                  } else {

                  }
                } else {
                  AppsEU.create({
                    appName: obj.appName,
                    seller: obj.seller,
                    sdpStatus: obj.appStatus,
                    tv: 'In Progress',
                    updateTime: obj.updateDate,
                    testCycles: 1,
                    replyTime: 0,
                    applicationId: obj.appId
                  }, function (err, app) {
                    if (err) res.json({
                      "result": err
                    });
                    AppsEU.find({
                      applicationId: obj.appId
                    }, function (err, app) {
                      if (err) res.json({
                        "result": err
                      });

                      // create Calendar data with this appName
                      var cal = new CalEU({
                        appId: app[0]._id
                      });
                      cal.save(function (err, data) {
                        if (err) res.json({
                          "result": err
                        });
                        res.json({
                          "result": true,
                          "data": data
                        });
                        log.info(new Date() + '  - POST /API/GK/' + data.appId);
                      });
                    });
                  });
                }
              });


            } else {
              /********************************NEED CHECK IT********************************/
              AppsEU.findOne({
                applicationId: obj.appId
              }, function (err, app) {
                if (err) res.json({
                  "result": err
                });


                obj.updateDate = obj.updateDate.split(' ')[0];

                //put some data for update here
                app.appName = obj.appName;
                app.sdpStatus = obj.appStatus;
                app.seller = obj.seller;
                app.applicationId = obj.appId;
                app.updateTime = new Date(obj.updateDate);
                // save the bear
                app.save(function (err) {
                  if (err)
                    res.json({
                      "result": err
                    });
                  res.json({
                    "result": true,
                    "data": app
                  });
                });
              });
            }
          });
        });


      } else if (req.body.table_caption === 'QA Request Mgmt') {
        var objectEU2 = JSON.parse(req.body.data);

        _.each(objectEU2, function (arr) {
          tempArr.push(_.object(headerArr2, arr));
        });
        _.each(tempArr, function (obj, num) {
          /********************************NEED CHECK IT********************************/
          AppsEU.findOne({
              applicationId: obj.appId
            },
            function (err, app) {
              if (err) res.json({
                "result": err
              });
              //put some data for update here
              // app.appName = obj.appName;
              // app.sdpStatus = obj.sdpStatus;
              var reg = /.+\((.+)\)/;
              if (app === null) {
                return false;
              }
              obj.updateDate = obj.updateDate.split(' ')[0];
              app.country = reg.exec(obj.country)[1];
              app.updateTime = new Date(obj.updateDate);

              app.save(function (err) {
                if (err)
                  res.json({
                    "result": err
                  });
                res.json({
                  "result": true,
                  "data": app
                });
              });

            });

        });


      }
    }
  });
};