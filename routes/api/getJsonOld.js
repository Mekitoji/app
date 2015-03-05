var _ = require('underscore');
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
    console.log(req.body.data);
    console.log(req.body.table_caption);
    console.log(req.body.region);
    var headerArr = ['empty', 'appId', 'region', 'gk', 'appName', 'seller', 'updateDate', 'appStatus', 'gkReview'];
    var headerArr2 = ['appId', 'appVer', 'Categoty', 'FileType', 'appName', 'country', 'price', 'updateDate', 'appStatus', 'gkReview', 'addTest'];
    var tempArr = [];
    //req.body.data
    //**************************************CIS
    if (req.body.region === 'CS') {
      //check table caption
      if (req.body.table_caption === 'Gate Keeper Review List') {
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
        //end here;

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
      //**************************************EU
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
      //**************************************ALL
    } else if (req.body.region === "all") {
      //check table caption
      if (req.body.table_caption === 'QA Request Mgt. List') {
        //parse incoming obj to json view
        var objectSandbox = JSON.parse(req.body.data);

        _.each(objectSandbox, function (arr) {
          tempArr.push(_.object(headerArr, arr));
        });
        _.each(tempArr, function (obj, num) {

          AppsSandbox.find({
            applicationId: obj.appId,
          }, function (err, data) {
            if (err) res.json({
              "result": err
            });
            if (data.length === 0) {
              approvedAppsSandbox.findOne({
                applicationId: obj.appId
              }, function (err, dataA) {
                if (dataA) {
                  if (obj.appStatus !== 'App QA approved') {
                    AppsSandbox.create({
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
                      AppsSandbox.find({
                        applicationId: obj.appId
                      }, function (err, app) {
                        if (err) res.json({
                          "result": err
                        });

                        // create Calendar data with this appName
                        var cal = new CalSandbox({
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
                  AppsSandbox.create({
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
                    AppsSandbox.find({
                      applicationId: obj.appId
                    }, function (err, app) {
                      if (err) res.json({
                        "result": err
                      });

                      // create Calendar data with this appName
                      var cal = new CalSandbox({
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
              AppsSandbox.findOne({
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
        var objectSandbox2 = JSON.parse(req.body.data);

        _.each(objectSandbox2, function (arr) {
          tempArr.push(_.object(headerArr2, arr));
        });
        _.each(tempArr, function (obj, num) {
          /********************************NEED CHECK IT********************************/
          AppsSandbox.findOne({
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
    } else {
      res.json({
        "result": false,
        "status": "Currenty support region: All, CIS, EU"
      });
    }
  });
};