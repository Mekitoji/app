var Tester = require('../../../models/CISEU/Tester.js');
var Cal = require('../../../models/CISEU/calendar');
var Apps = require('../../../models/CISEU/gkbase');
var log = require('../../../libs/log');

module.exports = function (app) {
  app.get('/api/ciseu/tester', function (req, res) {
    Tester.find(function (err, data) {
      if (err) {
        res.send(err);
      }
      res.json(data);
      log.info(new Date() + '  - GET /API/CISEU/TESTER');
    });
  });

  app.post('/api/ciseu/tester', function (req, res) {
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

  app.put('/api/ciseu/tester/:tester_id', function (req, res) {
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

  // app.put('/api/ciseu/tester/second/:tester_id', function(req, res) {
  //   Tester.findById(req.params.tester_id)
  // });
};
