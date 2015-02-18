var TesterStat = require('../../../models/CIS/testerStat');
var Cal = require('../../../models/CIS/calendar');
var Apps = require('../../../models/CIS/gkbase');
var log = require('../../../libs/log');
var User = require('../../../models/user');
var ObjectId = require('mongoose').Types.ObjectId;
var _ = require('lodash');

module.exports = function (app) {
  app.get('/api/cis/testerStat', function (req, res) {
    TesterStat.find({})
      .populate('user')
      .exec(function (err, data) {
        if (err) {
          res.send(err);
        } else {
          TesterStat.populate(data, {
            path: 'appStorage.app',
            model: 'Apps'
          }, function (err, data) {
            if (err) {
              res.send(err)
            } else {
              res.send(data);
            }
          })
        }
      });
  });



  app.post('/api/cis/testerStat', function (req, res) {
    console.log(req.body);
    var user = new ObjectId(req.body.user);
    TesterStat.create({
      name: req.body.name,
      user: user
    }, function (err, data) {
      if (err) {
        throw err;
      } else {
        data.save(function (err, data) {
          if (err) res.send(err);
        });
        res.send(data);
      }
    });
  });


  app.put('/api/cis/testerStat/insertCycle/:tester_id', function (req, res) {
    console.log(req.body);
    TesterStat.findById(req.params.tester_id, function (err, tester) {
      if (err) {
        throw err;
      } else {
        if (req.body.appNameTest) {
          console.log('gate1');
          var index = _.findIndex(tester.appStorage, function (data) {
            console.log(data.app);
            console.log(req.body.appNameTest);
            return data.app.toString() === req.body.appNameTest.toString();
          });
          console.log('index = %s', index);
          if (index !== -1) {
            console.log('gate2');
            if (tester.appStorage[index] && req.body.date && req.body.reason) {
              console.log('gate4');
              tester.appStorage[index].testCycleStorage.push({
                date: req.body.date,
                reason: req.body.reason
              });
              tester.appStorage[index].testCycle = tester.appStorage[index].testCycleStorage.length + 1;
              Apps.findById(req.body.appNameTest, function (err, app) {
                if (err) res.send(err);
                app.testCycles++;
                app.save(function (err, data) {
                  if (err) res.send(err);
                });
              });
              console.log(tester);
              console.log(tester.appStorage[index]);
              tester.markModified('appStorage');
              tester.save(function (err, data) {
                if (err) {
                  res.send(err)
                } else {
                  res.send(data);
                }
              });
            } else {
              res.send(500);
            }
          } else {
            console.log('gate3');
            var date = new Date();
            tester.appStorage.push({ //app obj
              app: new ObjectId(req.body.appNameTest), // get _id of mongo
              year: date.getFullYear(),
              testCycle: 2, //init testCycle 2 here
              respTime: 0, //init with respTime 0
              testCycleStorage: [{
                date: req.body.date,
                reason: req.body.reason
              }], // init testCycle array for insert obj = {date: Date(), reason: String}
            });
            Apps.findById(req.body.appNameTest, function (err, app) {
              if (err) res.send(err);
              app.testCycles++;
              app.save(function (err, data) {
                if (err) res.send(err);
              });
            });
            tester.save(function (err, data) {
              if (err) {
                res.send(err)
              } else {
                res.send(data);
              }
            });
          }
        }
      }
    });
  });

  app.put('/api/cis/testerStat/:tester_id', function (req, res) {
    //get tester by id
    TesterStat.findById(req.params.tester_id, function (err, tester) {
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
          tester.save(function (err, data) {
            if (err) {
              res.send(err)
            } else {
              res.send(data);
            }
          });
        } else if (req.body.insertNewApp === false) {
          if (req.body.appId) {
            var index = _.findIndex(tester.appStorage, function (data) {
              return data.app.toString() === req.body.appId.toString();
            });
            if (tester.appStorage[index] && req.body.date && req.body.reason) {
              tester.appStorage[index].testCycleStorage.push({
                date: req.body.date,
                reason: req.body.reason
              });
              tester.save(function (err, data) {
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

  app.delete('/api/cis/testerStat/:tester_id', function (req, res) {
    TesterStat.remove({
      _id: req.params.tester_id
    }, function (err, tester) {
      if (err) res.send(err);
      res.send(200);
    });
  });
};