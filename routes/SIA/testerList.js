var routesFunction = require('../../libs/routesFunction');
var TesterStat = require('../../models/SIA/testerStat');
var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../../models/user');
var Cal = require('../../models/SIA/calendar');
var Apps = require('../../models/SIA/gkbase');
var _ = require('lodash');

module.exports = function (app) {
  app.get('/sia/tester', routesFunction.checkPermissionSIA, function (req, res) {
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
  });
}