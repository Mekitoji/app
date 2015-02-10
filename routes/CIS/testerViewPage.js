var TesterStat = require('../../models/CIS/testerStat');
var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../../models/user');
var Cal = require('../../models/CIS/calendar');
var Apps = require('../../models/CIS/gkbase');
var _ = require('lodash');

module.exports = function (app) {
  app.get('/cis/tester/:tester_id', function (req, res) {
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
            res.locals.tester = data;
            res.render('testerProfile.ejs', {
              user: req.user, // get the user out of session and pass to template
            });
          }
        });

      });

  })

}