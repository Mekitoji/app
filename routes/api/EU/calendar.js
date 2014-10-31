var Cal = require('../../../models/EU/calendar');
var Apps = require('../../../models/EU/gkbase');
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