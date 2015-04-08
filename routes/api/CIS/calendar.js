var Cal = require('../../../models/CIS/calendar');
var Apps = require('../../../models/CIS/gkbase');
var ApprovedApps = require('../../../models/CIS/gkbaseApproved');
var ApprovedCal = require('../../../models/CIS/calendarForApprovedApps');
var TesterStat = require('../../../models/CIS/testerStat');
var _ = require('lodash');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function (app) {

  //GET data in json
  app.get('/api/cis/calendar', function (req, res) {
    Cal.find(function (err, app) {
      if (err) {
        res.send(err);
      }
      Cal.populate(app, {
        path: 'appId'
      }, function (err, data) {
        res.json(data);
      });
    });
  });

  app.get('/api/cis/calendar/approved', function (req, res) {
    ApprovedCal.find(function (err, app) {
      if (err) {
        res.send(err);
      }
      ApprovedCal.populate(app, {
        path: 'appId'
      }, function (err, data) {
        res.json(data);
      });
    });
  });

  app.get('/api/cis/calendar/rejected', function (req, res) {
    var rejectedApp;
    Apps.find(function (err, app) {
      var rejected = [];
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) {
        res.send(err);
      }
      for (var i = 0; i < app.length; i++) {
        if (app[i].tv === 'In Progress' && app[i].outdated === false) {
          rejected.push(app[i]);
        }
      }
      rejectedApp = rejected; // return all users in JSON format
    });

    Cal.find(function (err, app) {
      if (err) {
        res.send(err);
      }
      Cal.populate(app, {
        path: 'appId'
      }, function (err, data) {
        var result = [];
        var dataMap;
        if (rejectedApp[0] !== undefined) {
          for (var j = 0; j < rejectedApp.length; j++) {
            dataMap = data.map(function (dat) {
              return dat;
            });
            for (var i = dataMap.length - 1; i >= 0; i--) {
              if (dataMap[i].appId._id !== undefined) {
                if (dataMap[i].appId._id.toString() !== rejectedApp[j]._id.toString()) {
                  dataMap.splice(i, 1);
                }
              }
            }
            result = result.concat(dataMap);
          }
        } else {
          data.splice(0, data.length);
        }
        res.json(result);
      });
    });
  });

  app.get('/api/cis/calendar/outdated', function (req, res) {
    var outdatedApp;
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
      outdatedApp = outdated;
      // res.json(outdated); // return all users in JSON format
      // log.info(new Date() + '  - GET /API/CIS/GK/OUTDATED');
      Cal.find(function (err, app) {
        if (err) {
          res.send(err);
        }
        Cal.populate(app, {
          path: 'appId'
        }, function (err, data) {
          var result = [];
          var dataMap;
          if (outdatedApp[0] !== undefined) {
            for (var j = 0; j < outdatedApp.length; j++) {
              dataMap = data.map(function (dat) {
                return dat;
              });
              for (var i = dataMap.length - 1; i >= 0; i--) {
                if (dataMap[i].appId._id !== undefined) {
                  if (dataMap[i].appId._id.toString() !== outdatedApp[j]._id.toString()) {
                    dataMap.splice(i, 1);
                  }
                }
              }
              result = result.concat(dataMap);
            }
          } else {
            data.splice(0, data.length);
          }
          res.json(result);
        });
      });
    });


  });

  //pushing data in array
  app.put('/api/cis/calendar/:calendar_id', function (req, res) {
    Cal.findById(req.params.calendar_id, function (err, cal) { //findByIdAndUpdate
      if (err) {
        res.send(err);
      }

      //save calendar date in arr
      var saveCalendar = function () {
        cal.save(function (err, data) {
          if (err) {
            res.send(err);
          }
          res.json(data);
        });
      };

      var coutReplyTime = function (appId, storage) {
        var justL = 0,
          withHiddenL = 0,
          replyTime = 0;
        for (var i = 0; i < storage.length; i++) {
          if (storage[i].value === 'L' || storage[i].value === 'LL') {
            withHiddenL++;
          }
          if (storage[i].value === 'L') {
            justL++;
          }
        }
        replyTime = withHiddenL / justL;
        if (replyTime === Infinity || isNaN(replyTime)) {
          replyTime = 0;
        }
        Apps.findById(appId, function (err, app) {
          app.replyTime = replyTime;
          app.save(function (err, data) {
            if (err) throw err;
          });
        });
      };



      var findTesterAndPush = function (appId, valueObj) {
        //make request to db, and get obj with current app info 
        Apps.findById(appId, function (err, app) {
          if (err) {
            //if db throw err, send it to the server
            res.send(500, err);
          } else {
            //else go  work with data(app)
            //then make request to testerStat collection
            TesterStat.findOne({
              name: app.resp
            }, function (err, tester) {
              //handle err or start work with data(tester obj)
              if (err) {
                res.send(err);
              } else {
                //find index of appStorage with lodash
                var index = _.findIndex(tester.appStorage, function (data) {
                  //return value if data.app (id) === to appId of inserting data
                  return data.app.toString() === appId.toString();
                });
                //check index value 
                //if we got -1 it mean that the appStorage with the current app 
                //didn't find in current tester obj

                //if index is not -1 let just update our appStorage with new Value 
                if (index !== -1) {
                  //let handle  situation 1. when appStorage alredy got value for insert data
                  //2. when data/value didn't exist, so we need just push exist data to the respStorage 
                  //and count responseTime with method

                  //check if exist all needed data
                  if (tester.appStorage[index] && valueObj) {
                    //find if date is match
                    var indexForDate = _.findIndex(tester.appStorage[index].respStorage, function (data) {
                      //if date is match return value else return -1
                      return data.fullDate.toString() === valueObj.fullDate.toString();
                    });
                    //check if indexForDate is valid
                    var justL = 0,
                      withHiddenL = 0,
                      replyTime = 0;
                    if (indexForDate !== -1) {
                      //start handle 2.
                      //just change object value
                      tester.appStorage[index].respStorage[indexForDate].value = valueObj.value;
                      for (var i = 0; i < tester.appStorage[index].respStorage.length; i++) {
                        if (tester.appStorage[index].respStorage[i].value === 'L' || tester.appStorage[index].respStorage[i].value === 'LL') {
                          withHiddenL++;
                        }
                        if (tester.appStorage[index].respStorage[i].value === 'L') {
                          justL++;
                        }
                      }
                      replyTime = withHiddenL / justL;
                      if (replyTime === Infinity || isNaN(replyTime)) {
                        replyTime = 0;
                      }

                    } else {
                      //start handle 1.
                      tester.appStorage[index].respStorage.push(valueObj);
                      for (var i = 0; i < tester.appStorage[index].respStorage.length; i++) {
                        if (tester.appStorage[index].respStorage[i].value === 'L' || tester.appStorage[index].respStorage[i].value === 'LL') {
                          withHiddenL++;
                        }
                        if (tester.appStorage[index].respStorage[i].value === 'L') {
                          justL++;
                        }
                      }
                      replyTime = withHiddenL / justL;
                      if (replyTime === Infinity || isNaN(replyTime)) {
                        replyTime = 0;
                      }
                    }
                    tester.appStorage[index].respTime = replyTime;
                    //save this
                    tester.markModified('appStorage');
                    tester.save(function (err, data) {
                      if (err) {
                        res.send(err)
                      } else {
                        res.send(data);
                      }
                    });
                  } else {
                    // throw error if needed data not exist 
                    res.send(500, "We got a problem ");
                  }
                } else {
                  //else we  didn't have this app in tester appStorage, 
                  //let init new obj in it with standart app obj data

                  //get date, it will be used for init obj of app
                  var date = new Date();
                  //init array with objectData we get already pushed
                  var respArray = [];
                  respArray.push(valueObj);
                  //let push new obj in our appStorage
                  if (valueObj.value === "L" || valueObj.value === "LL") {
                    tester.appStorage.push({
                      app: new ObjectId(appId),
                      year: date.getFullYear(),
                      testCycle: 1,
                      respTime: 1,
                      testCycleStorage: [],
                      respStorage: respArray
                    });
                  } else {
                    tester.appStorage.push({
                      app: new ObjectId(appId),
                      year: date.getFullYear(),
                      testCycle: 1,
                      respTime: 0,
                      testCycleStorage: [],
                      respStorage: respArray
                    });
                  }
                  //here we not counting respTime L, coz it our first insert in respStorage
                  //save this obj
                  tester.save(function (err, result) {
                    //take error or go throw data with our cool final tester obj
                    if (err) {
                      res.send(500, err);
                    } else {
                      res.send(result);
                    }
                  });
                }

              }
            });
          }
        });
      }

      for (var i = 0; i < cal.storage.length; i++) {
        if (cal.storage[i].fullDate == req.body.fullDate) {
          cal.storage[i].value = req.body.value;
          coutReplyTime(cal.appId, cal.storage);
          findTesterAndPush(cal.appId, {
            fullDate: req.body.fullDate,
            value: req.body.value
          });
          saveCalendar();
          return false;
        }
      }
      if (cal.storage[cal.storage.length - 1] === undefined) {
        cal.storage.push({
          fullDate: req.body.fullDate,
          value: req.body.value
        });
        coutReplyTime(cal.appId, cal.storage);
        findTesterAndPush(cal.appId, {
          fullDate: req.body.fullDate,
          value: req.body.value
        });
        saveCalendar();
        return false;
      } else {
        if (cal.storage[cal.storage.length - 1].fullDate !== req.body.fullDate) {
          cal.storage.push({
            fullDate: req.body.fullDate,
            value: req.body.value
          });
          coutReplyTime(cal.appId, cal.storage);
          findTesterAndPush(cal.appId, {
            fullDate: req.body.fullDate,
            value: req.body.value
          });
          saveCalendar();
          return false;
        }
      }
    });
  });
};