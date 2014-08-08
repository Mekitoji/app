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
    Cal.create({
        appName: req.body.appName,
        Storage: {
          date: req.body.date,
          value: req.body.value
        }
      },
      function (err, app) {
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

  app.delete('/api/calendar/:calendar_id', function (req, res) {
    Cal.remove({
      _id: req.params.calendar_id
    }, function (err, app) {
      if (err) {
        res.send(err);
      }

      Cal.finc(function (err, calen) {
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
      if (req.body.appName) cal.appName = req.body.appName;
      if (req.body.storage.drive) cal.storage.drive = req.body.drive;
      if (req.body.storage.value) cal.storage.value = req.body.value;

      cal.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.json();
      });
    });
  });
};