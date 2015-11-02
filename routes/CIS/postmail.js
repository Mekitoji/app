var nodemailer = require('nodemailer');
var routesFunction = require('../../libs/routesFunction');
var phantom = require('phantom');
var async = require('async');
var fs = require('fs');

module.exports = function (app) {
  app.get('/cis/:year/postmail', routesFunction.checkPermissionGkCIS, function (req, res, next) {
    res.locals.path = req.path;
    res.locals.year = req.params.year;

    var d = new Date();
    var dd = d.getDate();
    var dm = d.getMonth() + 1;
    var dy = d.getFullYear();

    // so bad
    function generateChartName() {
      var result = '' + dd + '-' + dm + '-' + dy + '-chart.png';
      return result;
    }

    var name = generateChartName();
    var host = req.get('host');
    // #@@$@4!#!$! bad!!
    var stat = fs.stat('./public/images/charts/' + generateChartName(), function(err, stats) {
      if(err && err.code === 'ENOENT') {

        async.series([
          function(cb) {
            phantom.create(function (ph) {
              ph.createPage(function (page) {
                page.open('http://' + host + '/' + dy + '/rate', function () {
                  var chartPath = './public/images/charts/';
                  page.render(chartPath + name);
                  ph.exit();
                  cb(null);
                });
              });
            });
          }
        ], function(err) {
            if (req.user) {
              res.render('postmail.ejs', {
                user: req.user // get the user out of session and pass to template
              });
            }
        });

      } else {
        if(req.user) {
          res.render('postmail.ejs', {
            user: req.user
          });
        }
      }
    });



  });

  app.post('/cis/postmail', routesFunction.checkPermissionGkCIS, function (req, res) {
    var transport = nodemailer.createTransport();

    var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var temp = new Date();
    var temp_date = temp.getDate();
    var temp_month = temp.getMonth();
    var temp_year = temp.getFullYear();


    var subject = "[Share][STE Report] " + temp_date + " " + monthArray[temp_month] + " " + temp_year;

    var mailOptions = {
      from: 'CIS STE <noreply@lge.com>', // sender address
      to: 'vladimir.egorov@lge.com', // list of receivers
      // cc: ['andrey.sayants@lge.com'],
      subject: subject, // Subject line
      replyTo: 'andrey.sayants@lge.com',
      text: req.body.text, // plaintext body
      html: req.body.text, // html body
    };
    console.log(subject);
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent: ');
        console.log(info);
      }
    });
  });
};
