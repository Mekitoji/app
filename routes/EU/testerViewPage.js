var TesterStat = require('../../models/EU/testerStat');
var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../../models/user');
var Cal = require('../../models/EU/calendar');
var Apps = require('../../models/EU/gkbase');
var _ = require('lodash');

module.exports = function (app) {
  app.get('/eu/tester/:tester_id', function (req, res) {
    TesterStat.findById(req.params.tester_id)
      .populate('user')
      .exec(function (err, tester) {
        if (err) res.send(err);
        TesterStat.populate(tester, {
          path: 'appStorage.app',
          model: 'Apps'
        }, function (err, data) {
          if (err) {
            res.send(err)
          } else {
            // res.send(data);
            res.locals.path = req.path;
            res.locals.tester = data;
            res.render('testerProfile.ejs', {
              user: req.user, // get the user out of session and pass to template
            });
          }
        });
      });
  })
}