var Tester = require('../../../models/Sandbox/Tester.js');
var Cal = require('../../../models/Sandbox/calendar');
var Apps = require('../../../models/Sandbox/gkbase');
var log = require('../../../libs/log');

module.exports = function (app) {
  app.get('/api/global/tester', function (req, res) {
    Tester.find(function (err, data) {
      if (err) {
        res.send(err);
      }
      res.json(data);
      log.info(new Date() + '  - GET /API/global/TESTER');
    });
  });

  app.post('/api/global/tester', function (req, res) {
    Tester.create({
      tester: req.body.tester
    }, function (err, data) {
      if (err)
        res.send(err);
      Tester.findOne({
        tester: req.body.tester
      }, function (err, tester) {
        if (err) res.send(err);
        res.json(tester);
      });
    });
  });

  app.put('/api/global/tester/:tester_id', function (req, res) {
    Tester.findById(req.params.tester_id, function (err, tester) {
      if (err) res.send(err);
      tester.Storage.push({
        appNameTest: req.body.appNameTest,
        date: req.body.date,
        reason: req.body.reason
      });

      tester.save(function (err, data) {
        if (err) res.send(err);
        Apps.findOne({
          appName: req.body.appNameTest
        }, function (err, app) {
          if (err) res.send(err);
          app.testCycles++;
          app.save(function (err, data) {
            if (err) res.send(err);
          });
        });
        res.json(data);
      });
    });
  });
};