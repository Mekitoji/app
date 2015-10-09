var routesFunction = require('../../libs/routesFunction');
var TesterStat = require('../../models/CIS/testerStat');
var Rate = require('../../models/rate');
var nodemailer = require('nodemailer');
var phantom = require('phantom');
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
  app.post('/cis/:year/tester', routesFunction.checkPermissionGkCIS, function(req, res) {
    var transport = nodemailer.createTransport();

    var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var temp = new Date();
    var temp_date = temp.getDate();
    var temp_month = temp.getMonth();
    var temp_year = temp.getFullYear();

    function generateChartName() {
      var d = new Date();
      var dd = d.getDate();
      var dm = d.getMonth() + 1;
      var dy = d.getFullYear();
      var result = '' + dd + '-' + dm + '-' + dy + '-chart.png';
      return result;
    }

    var host = req.get('host');
    var subject = '[Share][Report] ' + temp_date + ' ' + monthArray[temp_month] + ' ' + temp_year;
    var name = generateChartName();
    phantom.create(function (ph) {
      ph.createPage(function (page) {
        page.open('http://' + host + '/' + temp_year + '/rate', function () {
          var chartPath = './public/images/charts/';
          page.render(chartPath + name);
          ph.exit();
        });
      });
    });

    var text = '<-Text here <br> Screenshot: <br> <img src="' + host + '/images/charts/' + name + '" alt="" /> <br> BR';

    var mailOptions = {
      from: 'CIS STE <noreply@lge.com>', // sender address
      to: 'vladimir.egorov@lge.com', // list of receivers
      // cc: ['andrey.sayants@lge.com'],
      subject: subject, // Subject line
      // replyTo: 'andrey.sayants@lge.com',
      text: text, // plaintext body
      html: text, // html body
    };

    transport.sendMail(mailOptions, function(err, info) {
      if(err)
        console.error(err);
      else
        console.log(info);
      res.send(200);
    });
  });
};
