var Cal = require('../../../models/EU/calendar');
var Apps = require('../../../models/EU/gkbase');
var ApprovedApps = require('../../../models/EU/gkbaseApproved');
var ApprovedCal = require('../../../models/EU/calendarForApprovedApps');

module.exports = function (app) {

  //GET data in json
  app.get('/api/eu/calendar', function (req, res) {
    Cal.find(function (err, app) {
      if (err) {
        res.send(err);
      }
      console.log(app);
      Cal.populate(app, {
        path: 'appId'
      }, function (err, data) {
        res.json(data);
      });
    });
  });

  app.get('/api/eu/calendar/approved', function (req, res) {
    ApprovedCal.find(function (err, app) {
      if (err) {
        res.send(err);
      }
      console.log(app);
      ApprovedCal.populate(app, {
        path: 'appId'
      }, function (err, data) {
        res.json(data);
      });
    });
  });

  app.get('/api/eu/calendar/rejected', function (req, res) {
    var rejectedApp;
    Apps.find(function (err, app) {
      var rejected = [];
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) {
        res.send(err);
      }
      for (var i = 0; i < app.length; i++) {
        if (app[i].tv === 'Reject' && app[i].outdated === false) {
          rejected.push(app[i]);
        }
      }
      rejectedApp = rejected; // return all users in JSON format
      // log.info(new Date() + '  - GET /API/CIS/GK/REJECTED');
    });


    Cal.find(function (err, app) {
      if (err) {
        res.send(err);
      }
      console.log(app);
      Cal.populate(app, {
        path: 'appId'
      }, function (err, data) {
        console.log('rejectedApp');
        console.log(rejectedApp);
        var result = [];
        var dataMap;
        if (rejectedApp[0] !== undefined) {
          console.log('here');
          for (var j = 0; j < rejectedApp.length; j++) {
            dataMap = data.map(function (dat) {
              return dat;
            });
            console.log(dataMap);
            for (var i = dataMap.length - 1; i >= 0; i--) {
              if (dataMap[i].appId._id !== undefined) {
                console.log(dataMap[i].appId._id.toString());
                console.log(rejectedApp[j]._id.toString());
                console.log(dataMap[i].appId._id.toString() !== rejectedApp[j]._id.toString());
                if (dataMap[i].appId._id.toString() !== rejectedApp[j]._id.toString()) {
                  dataMap.splice(i, 1);
                  console.log(i);
                }
              }
            }
            result = result.concat(dataMap);
            console.log(data);
          }
          console.log('final data');
          console.log(result);
        } else {
          data.splice(0, data.length);
        }
        console.log(result);
        res.json(result);
      });
    });
  });

  app.get('/api/eu/calendar/outdated', function (req, res) {
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
      // log.info(new Date() + '  - GET /API/eu/GK/OUTDATED');
    });

    Cal.find(function (err, app) {
      if (err) {
        res.send(err);
      }
      console.log(app);
      Cal.populate(app, {
        path: 'appId'
      }, function (err, data) {
        console.log('outdatedApp');
        console.log(outdatedApp);
        if (outdatedApp[0] !== undefined) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].appId._id.toString() != outdatedApp[i]._id.toString()) {
              data.splice(i, 1);
            }
          }
        } else {
          data.splice(0, data.length);
        }
        res.json(data);
      });
    });
  });



  //post and delete method was deleted, coz unuse

  /*  app.post('/api/calendar', function (req, res) {
    var cal = new Cal({
      appName: req.body.appName,
      appId: req.body._id,
      storage: [{
        day: req.body.date.getDay(),
        month: req.body.date.getMonth(),
        year: req.body.date.getYear(),
        value: req.body.value,
      }]
    });

    cal.save(function (err, data) {
      if (err) throw err;
      res.json(data);
    });
  });*/

  /*app.delete('/api/calendar/:calendar_id', function (req, res) {
    Cal.remove({
      _id: req.params.calendar_id
    }, function (err, cal) {
      if (err) {
        res.send(err);
      }

      Cal.find(function (err, calen) {
        if (err) {
          res.send(err);
        }
        res.json(calen);
      });
    });
  });*/


  //pushing data in array
  app.put('/api/eu/calendar/:calendar_id', function (req, res) {
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


      for (var i = 0; i < cal.storage.length; i++) {
        if (cal.storage[i].fullDate == req.body.fullDate) {
          cal.storage[i].value = req.body.value;
          console.log('rewrite');
          console.log(cal.appId);
          coutReplyTime(cal.appId, cal.storage);
          saveCalendar();
          return false;
        }
      }
      if (cal.storage[cal.storage.length - 1] === undefined) {
        cal.storage.push({
          //omg it a string!!
          fullDate: req.body.fullDate,
          value: req.body.value
        });
        console.log('push in new app');
        console.log(cal.appId);
        coutReplyTime(cal.appId, cal.storage);
        saveCalendar();
        return false;
      } else {
        if (cal.storage[cal.storage.length - 1].fullDate !== req.body.fullDate) {
          console.log(cal.storage.length);
          console.log(cal.storage[cal.storage.length - 1].fullDate);
          console.log(req.body.fullDate);
          cal.storage.push({
            //omg it a string!!

            fullDate: req.body.fullDate,
            value: req.body.value
          });
          console.log('push new');
          console.log(cal.appId);
          coutReplyTime(cal.appId, cal.storage);
          saveCalendar();
          return false;
        }
      }
    });
  });
};