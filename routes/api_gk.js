var Apps = require('../models/gkbase');
var Cal = require('../models/calendar');
var ObjectId = require('mongoose').Types.ObjectId;
var log = require('../libs/log');

module.exports = function (app) {


  // api ---------------------------------------------------------------------

  //get all
  app.get('/api/gk', function (req, res) {
    // use mongoose to get all gk in the database
    Apps.find(function (err, app) {
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err);
      res.json(app); // return all users in JSON format
      log.info(new Date() + '  - GET /API/GK');
    });
  });

  //rejected filter
  app.get('/api/gk/rejected', function (req, res) {
    // use mongoose to get rejected apps from the database
    Apps.find(function (err, app) {
      var rejected = [];
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) {
        res.send(err);
      }
      for (var i = 0; i < app.length; i++) {
        if (app[i].tv === 'Reject') {
          rejected.push(app[i]);
        }
      }
      res.json(rejected); // return all users in JSON format
      log.info(new Date() + '  - GET /API/GK/REJECTED');
    });
  });

  //approved filter
  app.get('/api/gk/approved', function (req, res) {
    // use mongoose to get approved apps from the database
    Apps.find(function (err, app) {
      var approved = [];
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) res.send(err);
      for (var i = 0; i < app.length; i++) {
        if (app[i].tv === 'Approve' || app[i].tv === 'Partial') {
          approved.push(app[i]);
        }
      }
      res.json(approved); // return all users in JSON format
      log.info(new Date() + '  - GET /API/GK/APPROVED');

    });
  });

  //outdated filter
  app.get('/api/gk/outdated', function (req, res) {
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
      log.info(new Date() + '  - GET /API/GK/OUTDATED');
    });
  });

  // create user and send back all users after creation
  app.post('/api/gk', function (req, res) {
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
      outdated: req.body.outdated
    }, function (err, app) {
      if (err)
        res.send(err);
      // get and return all the users after you create another
      Apps.find({
        appName: req.body.appName
      }, function (err, app) {
        if (err) res.send(err);
        //get our field
        res.json(app);
        // create Calendar data with this appName
        var cal = new Cal({
          appId: app[0]._id
        });
        cal.save(function (err, data) {
          if (err) console.log(err);
          res.json(data);
          log.info(new Date() + '  - POST /API/GK/' + data.appId);
        });
      });
    });
  });

  // delete a user
  app.delete('/api/gk/:app_id', function (req, res) {
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

  //update a user
  app.put('/api/gk/:app_id', function (req, res) {
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
      if (req.body.currentStatus) app.currentStatus = req.body.currentStatus;
      if (req.body.testCycles) app.testCycles = req.body.testCycles;
      if (req.body.replyTime) app.replyTime = req.body.replyTime;
      if (req.body.resp) app.resp = req.body.resp;
      if (req.body.resp) app.outdated = req.body.outdated;
      // save the bear
      app.save(function (err) {
        if (err)
          res.send(err);
        res.json(app);
      });
    });
  });
  // application -------------------------------------------------------------
  //add emitter for development and production env
};

/*.post(function(req, res) {
    
    var bear = new Bear();    // create a new instance of the Bear model
    bear.name = req.body.name;  // set the bears name (comes from the request)

    // save the bear and check for errors
    bear.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Bear created!' });
    });
    
  });
*/