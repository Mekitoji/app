var Cal = require('../models/calendar');
var Apps = require('../models/gkbase');
module.exports = function (app) {

  //GET data in json
  app.get('/api/calendar', function (req, res) {
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
  app.put('/api/calendar/:calendar_id', function (req, res) {
    Cal.findById(req.params.calendar_id, function (err, cal) { //findByIdAndUpdate
      if (err) {
        res.send(err);
      }

      cal.storage.push({
        day: (new Date(req.body.date)).getDate(),
        month: (new Date(req.body.date)).getMonth(),
        year: (new Date(req.body.date)).getFullYear(),
        value: req.body.value
      });
      cal.save(function (err, data) {
        if (err) {
          res.send(err);
        }
        res.json(data);
      });
    });
  });
};