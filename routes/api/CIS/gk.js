var Apps = require('../../../models/CIS/gkbase');
var ApprovedApps = require('../../../models/CIS/gkbaseApproved');
var Cal = require('../../../models/CIS/calendar');
var ApprovedCal = require('../../../models/CIS/calendarForApprovedApps');
var ObjectId = require('mongoose').Types.ObjectId;
var log = require('../../../libs/log');
var Rate = require('../../../models/rate');

module.exports = function (app) {


  // api ---------------------------------------------------------------------


  //get all, raw data
  app.get('/api/cis/gk/all', function (req, res) {
    Apps.find(function (err, apps) {
      if (err) {
        console.error(err);
      }
      res.json(apps);
    });
  });

  //get all not approved
  app.get('/api/cis/gk', function (req, res) {

    // use mongoose to get all gk in the database
    Apps.find(function (err, app) {
      var rejectedAndOutdated = [];
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) {
        res.send(err);
      }
      for (var i = 0; i < app.length; i++) {
        if (app[i].tv !== "Approved" && app[i].tv !== "Partial") {
          rejectedAndOutdated.push(app[i]);
        } else {}
      }
      res.json(rejectedAndOutdated); // return all users in JSON format
      log.info(new Date() + '  - GET /API/CIS/GK');
    });
  });

  app.get('/api/cis/gk/notReviewed', function (req, res) {

    // use mongoose to get all gk in the database
    Apps.find(function (err, app) {
      var notReviewed = [];
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) {
        res.send(err);
      }
      for (var i = 0; i < app.length; i++) {
        if (app[i].tv === "Not Reviewed") {
          notReviewed.push(app[i]);
        }
      }
      res.json(notReviewed); // return all users in JSON format
      log.info(new Date() + '  - GET /API/CIS/GK');
    });
  });

  //rejected filter
  app.get('/api/cis/gk/rejected', function (req, res) {
    // use mongoose to get rejected apps from the database
    Apps.find(function (err, app) {
      var rejected = [];
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) {
        res.send(err);
      }
      for (var i = 0; i < app.length; i++) {
        if (app[i].tv === 'In Progress' && app[i].outdated === false && app[i].sdpStatus !== 'Revise') {
          rejected.push(app[i]);
        }
      }
      res.json(rejected); // return all users in JSON format
      log.info(new Date() + '  - GET /API/CIS/GK/REJECTED');
    });
  });

  //approved filter
  app.get('/api/cis/gk/approved', function (req, res) {
    // use mongoose to get approved apps from the database
    ApprovedApps.find(function (err, app) {
      if (err) res.send(err);
      // for (var i = 0; i < app.length; i++) {
      //   if (app[i].tv === 'Approve' || app[i].tv === 'Partial') {
      //     approved.push(app[i]);
      //   }
      // }
      res.json(app); // return all users in JSON format
      log.info(new Date() + '  - GET /API/GK/APPROVED');

    });
  });

  //outdated filter
  app.get('/api/cis/gk/outdated', function (req, res) {
    // use mongoose to get outdated apps from the database
    Apps.find(function (err, app) {
      var outdated = [];
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) {
        res.send(err);
      }
      for (var i = 0; i < app.length; i++) {
        if (app[i].outdated === true) {
          outdated.push(app[i]);
        }
      }
      res.json(outdated); // return all users in JSON format
      log.info(new Date() + '  - GET /API/CIS/GK/OUTDATED');
    });
  });


  app.get('/api/cis/gk/:app_id', function (req, res) {
    // console.log(req.params.app_id);
    Apps.findById(req.params.app_id, function (err, data) {

      if (err) res.send(err);
      res.json(data);
    });
  });

  // create user and send back all users after creation
  app.post('/api/cis/gk', function (req, res) {
    // create a user, information comes from request from Angular
    Apps.create({
      country: req.body.country,
      appName: req.body.appName,
      category: req.body.category,
      sdpStatus: req.body.sdpStatus,
      updateTime: req.body.updateTime,
      seller: req.body.seller,
      tv: req.body.tv,
      currentStatus: req.body.currentStatus,
      testCycles: req.body.testCycles,
      replyTime: req.body.replyTime,
      resp: req.body.resp,
      outdated: false,
      applicationId: req.body.applicationId,
      color: req.body.color
    }, function (err, app) {
      if (err)
        res.send(err);
      // get and return all the users after you create another
      Apps.find({
        applicationId: req.body.applicationId
      }, function (err, app) {
        if (err) res.send(err);
        //get our field
        res.json(app);
        // create Calendar data with this appName
        var cal = new Cal({
          appId: app[0]._id
        });
        cal.save(function (err, data) {
          if (err) res.send(err);
          res.json(data);
          log.info(new Date() + '  - POST /API/CIS/GK/' + data.appId);
        });
      });
    });
  });

  // delete a user
  app.delete('/api/cis/gk/:app_id', function (req, res) {
    Apps.remove({
      _id: req.params.app_id
    }, function (err, app) {
      if (err)
        res.send(err);

      // get and return all the users after you create another
      Apps.find({
        appId: req.params.app_id
      }, function (err, apps) {
        if (err)
          res.send(err);
        Cal.remove({
          appId: new ObjectId(req.params.app_id)
        }, function (err, cal) {
          if (err) res.send(err);
          Cal.find(function (err, data) {
            if (err) res.send(err);
            res.json(data);
          });
        });
      });
    });
  });


  //get one user


  //update a user
  app.put('/api/cis/gk/:app_id', function (req, res) {

    //check if data is approved
    //then delete in thisd db and save at new
    var checkApproved = function (id) {

      //for apps
      Apps.findById(id, function (err, data) {
        if (err) res.send(err);
        data.applicationId = data.applicationId + "/private/" + Math.random().toString().slice(2);
        if (req.body.tv === 'Approved') {
          data.tv = 'Approved';
          data.outdated = false;
        } else if (req.body.tv === 'Partial') {
          data.tv = 'Partial';
          data.outdated = false;
        }
        ApprovedApps.create(data, function (err, apps) {
          if (err) res.send(err);
          //check if it approved for all device or not
          if (req.body.tv === 'Approved') {
            apps.tv = 'Approved';
            apps.outdated = false;
          } else if (req.body.tv === 'Partial') {
            apps.tv = 'Partial';
            apps.outdated = false;
          }
          //save
          apps.save(function (err, data) {
            if (err) res.send(err);
            res.json(data);
          });
        });
        //remove from main gk base
        // Apps.findByIdAndRemove(id, function (err, data) {
        //   if (err) res.send(err);
        // });
        function addPassToMonth(region) {
          var date = new Date(data.updateTime);
          var month = date.getMonth();
          var year = date.getFullYear();
          region.findMonth(month, year, function(err, month) {
            if(err) return console.error(err);
            console.log(month);
            month.addPass(id);
            region.markModified('months');
            region.save(function(err) {
              if(err) return console.error(err);
            });
          });
        }
        // Pass Rate
        Cal.findOne({
          'appId': id
        })
        .exec(function(err, cal) {
          if(err) return console.error(err);
          if(cal.storage.length !== 0) {
            console.log(cal.storage);
            Rate.getRegion('CIS', function(err, data) {
              if(err) console.error(err);
              if(!data) {
                Rate.addRegion('CIS', function(err, data) {
                  if(err) return console.error(err);
                  addPassToMonth(data);
                });
              } else {
                addPassToMonth(data);
              }
            });
          }
        });

        data.save(function (err, appz) {
          if (err) throw err;

        });
      });

      //for calendar
      Cal.findOne({
        'appId': id
      }, function (err, cal) {
        if (err) res.send(err);
        //save in new collection
        ApprovedCal.create(cal, function (err, data) {
          if (err) res.send(err);
          data.save(function (err, data) {
            if (err) res.send(err);
          });
        });
        //remove from main gk base
        Cal.findOneAndRemove({
          'appId': id
        }, function (err, data) {
          if (err) res.send(err);
        });
      });
    };

    // use our bear model to find the bear we want
    Apps.findById(req.params.app_id, function (err, app) {

      if (err) res.send(err);
      //put some data for update here
      if (req.body.country) app.country = req.body.country;
      if (req.body.appName) app.appName = req.body.appName;
      if (req.body.category) app.category = req.body.category;
      if (req.body.sdpStatus) app.sdpStatus = req.body.sdpStatus;
      if (req.body.updateTime) app.updateTime = req.body.updateTime;
      if (req.body.seller) app.seller = req.body.seller;
      if (req.body.tv) app.tv = req.body.tv;
      if (req.body.testCycles) app.testCycles = req.body.testCycles;
      if (req.body.replyTime) app.replyTime = req.body.replyTime;
      if (req.body.resp) app.resp = req.body.resp;
      if (req.body.applicationId) app.applicationId = req.body.applicationId;
      if (req.body.color) app.color = req.body.color;
      if (req.body.outdated === 'true' || req.body.outdated === true) {
        app.outdated = true;
      } else if (req.body.outdated === 'false' || req.body.outdated === false) {
        app.outdated = false;
      } else {
        app.outdated = false;
      }
      if (req.body.tv === "Not Reviewed") {
        app.currentStatus = "Not Reviewed";
        app.color = 'grey';
      }

      //check and change with preload Status
      if (req.body.currentStatus) {
        app.currentStatus = req.body.currentStatus;
        if (req.body.currentStatus === 'Waiting for fix' || req.body.currentStatus === 'Approved') {
          app.color = 'green';
          req.body.color = 'green';
        } else if (req.body.currentStatus === 'Waiting for review') {
          app.color = 'orange';
          req.body.color = 'orange';
        } else if (req.body.currentStatus === 'Waiting for QA') {
          app.color = 'purple';
          req.body.color = 'purple';
        } else if (req.body.currentStatus === 'Not Reviewed') {
          app.color = 'grey';
          req.body.color = 'grey';
        }
      }

      app.save(function (err, response) {
        if (err) res.send(err);
        res.json(response);
      });

      if (req.body.tv === 'Approved' || req.body.tv === 'Partial') {
        checkApproved(req.params.app_id);
        // console.log(req.body.outdated);
      }
    });
  });
};
