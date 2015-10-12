var TesterStat = require('../../../models/CIS/testerStat');
var Cal = require('../../../models/CIS/calendar');
var Apps = require('../../../models/CIS/gkbase');
var log = require('../../../libs/log');
var User = require('../../../models/user');
var ObjectId = require('mongoose').Types.ObjectId;
var Rate = require('../../../models/rate');
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
              res.send(err);
            } else {
              res.send(data);
            }
          });
        }
      });
  });


  
  app.post('/api/cis/testerStat', function (req, res) {
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

    function addFailToMonth(region) {
      var date = new Date(req.body.date);
      var month = date.getMonth();
      var year = date.getFullYear();
      region.findMonth(month, year, function(err, month) {
        if(err) return console.error(err);
        month.addFail(req.body.appNameTest);
        region.markModified('months');
        region.save(function(err) {
          if(err) return console.error(err);
        });
      });
    }

    TesterStat.findById(req.params.tester_id, function (err, tester) {
      if (err) {
        throw err;
      } else {
        if (req.body.appNameTest) {
          var year = (new Date(req.body.date)).getFullYear();
          var index = _.findIndex(tester.appStorage, function (data) {
            return data.app.toString() === req.body.appNameTest.toString() && year === data.year;
          });
          if (index !== -1) {
            if (tester.appStorage[index] && req.body.date && req.body.reason) {
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
              tester.markModified('appStorage');


           //  ********************** Pass Rate
              Rate.getRegion('CIS', function(err, data) {
                if(err) console.error(err);
                if(!data) {
                  Rate.addRegion('CIS', function(err, data) {
                    if(err) return console.error(err);
                    addFailToMonth(data);
                  });
                } else {
                  addFailToMonth(data);
                }
              });



              // *************

              tester.save(function (err, data) {
                if (err) {
                  res.send(err);
                } else {
                  res.send(data);
                }
              });
            } else {
              res.send(500);
            }
          } else {
            var date = new Date(req.body.date);
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



     //  ********************** Pass Rate
        Rate.getRegion('CIS', function(err, data) {
          if(err) console.error(err);
          if(!data) {
            Rate.addRegion('CIS', function(err, data) {
              if(err) return console.error(err);
              addFailToMonth(data);
            });
          } else {
            addFailToMonth(data);
          }
        });

        // *************









            tester.save(function (err, data) {
              if (err) {
                res.send(err);
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
              res.send(err);
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
                res.send(data);
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
