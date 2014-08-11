var Cal = require('../models/calendar.js');

module.exports = function (app) {
  app.get('/api/calendar', function (req, res) {
    Cal.find(function (err, app) {
      if (err) {
        res.send(err);
      }
      res.json(app);
    });
  });

  app.post('/api/calendar', function (req, res) {
    var cal = new Cal({
      appName: req.body.appName,
      storage: [{
        date: req.body.date,
        value: req.body.value,
      }]
    })

    cal.save(function (err, data) {
      if (err) throw err;
      res.json(data);
    })
  });

  app.delete('/api/calendar/:calendar_id', function (req, res) {
    Cal.remove({
      _id: req.params.calendar_id
    }, function (err, app) {
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
  });

  app.put('/api/calendar/:calendar_id', function (req, res) {
    Cal.findById(req.params.calendar_id, function (err, cal) { //findByIdAndUpdate
      if (err) {
        red.send(err)
      };
      cal.storage.push({
        date: req.body.date,
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