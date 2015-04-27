var routesFunction = require('../../libs/routesFunction');
var TesterStat = require('../../models/Sandbox/testerStat');
var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../../models/user');
var Cal = require('../../models/Sandbox/calendar');
var Apps = require('../../models/Sandbox/gkbase');
var _ = require('lodash');

module.exports = function (app) {
  app.get('/global/:year/tester', routesFunction.checkPermissionSandbox, function (req, res) {
    TesterStat.find({})
      .populate('user')
      .exec(function (err, testers) {
        if (err) res.send(err);
        TesterStat.populate(testers, {
          path: 'appStorage.app',
          model: 'AppsSandbox'
        }, function (err, data) {
          if (err) res.send(err);
          // res.send(data);
          res.locals.testers = data;
          res.locals.path = req.path;
          res.locals.year = req.params.year;
          res.render('testerList.ejs', {
            user: req.user
          });
        });
      });

  });
}