var TesterStat = require('../../../models/CIS/testerStat');
var Cal = require('../../../models/CIS/calendar');
var Apps = require('../../../models/CIS/gkbase');
var log = require('../../../libs/log');
var User = require('../../../models/user');
var ObjectId = require('mongoose').Types.ObjectId;
var _ = require('lodash');

module.exports = function(app) {

  app.get('/api/cis/testerStat', function(req, res) {
    TesterStat.find(function(err, data) {
      if (err) {
        throw err;
      } else {
        TesterStat.populate(data, {
          path: 'user'
        }, function(err, data) {
          if (err) {
            res.send(err);
          } else {
            log.info(new Date() + ' - GET /API/CIS/TESTERSTAT');
            res.send(data);
          }
        });
      }
    });
  });



  app.post('/api/cis/testerStat', function(req, res) {
    console.log(req.body);
    var user = new ObjectId(req.body.user);
    TesterStat.create({
      name: req.body.name,
      user: user
    }, function(err, data) {
      if (err) {
        throw err;
      } else {
        data.save(function(err, data) {
          if (err) res.send(err);
        });
        res.send(data);
      }
    });
  });


  app.put('/api/cis/testerStat/insertCycle/:tester_id', function(req, res) {
    console.log(req.body);

  });

  app.put('/api/cis/testerStat/:tester_id', function(req, res) {
    //get tester by id
    TesterStat.findById(req.params.tester_id, function(err, tester) {
      if (err) {
        throw err;
      } else {
        // if add new app to the tester-user trigger insertNewApp to true
        if (req.body.insertNewApp === true) {
          if (req.body._id) {
            var date = new Date();
            tester.appStorage.push({ //app obj
              app: new ObjectId(req.body._id), // get _id of mongo
              year: date.getFullYear(),
              testCycle: 1, //init testCycle 1
              respTime: 0, //init with respTime 0
              testCycleStorage: [], // init testCycle array for insert obj = {date: Date(), reason: String}
            });
          }
          //save or new data
          tester.save(function(err, data) {
            if (err) {
              res.send(err)
            } else {
              res.send(data);
            }
          });
        } else if (req.body.insertNewApp === false) {
          if (req.body.appId) {
            var index = _.findIndex(tester.appStorage, function(data) {
              return data.app.toString() === req.body.appId.toString();
            });
            if (tester.appStorage[index] && req.body.date && req.body.reason) {
              tester.appStorage[index].testCycleStorage.push({
                date: req.body.date,
                reason: req.body.reason
              });
              tester.save(function(err, data) {
                if (err) res.send(500, err);
                res.send(data)
              });
            } else {
              res.send(500);
            }

          }
        }
      }
    });
  });

  app.delete('/api/cis/testerStat/:tester_id', function(req, res) {
    TesterStat.remove({
      _id: req.params.tester_id
    }, function(err, tester) {
      if (err) res.send(err);
      res.send(200);
    });
  });
};