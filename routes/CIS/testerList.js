var routesFunction = require('../../libs/routesFunction');
var TesterStat = require('../../models/CIS/testerStat');
var Rate = require('../../models/rate');
// var ObjectId = require('mongoose').Types.ObjectId;
// var User = require('../../models/user');
// var Cal = require('../../models/CIS/calendar');
// var Apps = require('../../models/CIS/gkbase');
// var _ = require('lodash');

module.exports = function (app) {
  app.get('/cis/:year/tester', routesFunction.checkPermissionCIS, function (req, res) {
    res.locals.path = req.path;
    res.locals.year = req.params.year;
    TesterStat.find({})
      .populate('user')
      .exec(function (err, testers) {
        if (err) res.send(err);
        TesterStat.populate(testers, {
          path: 'appStorage.app',
          model: 'Apps'
        }, function (err, data) {
          if (err) res.send(err);
          // res.send(data);
          res.locals.testers = data;
          res.locals.path = req.path;
          res.render('testerList.ejs', {
            user: req.user
          });
        });
      });
      // Rate
  });
};