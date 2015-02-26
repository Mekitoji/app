var mongoose = require('../libs/mongoose');
var Apps = require('../models/CIS/gkbase');
var ApprovedApps = require('../models/CIS/gkbaseApproved');
var Calendar = require('../models/CIS/calendar');
var ApprovedCalendar = require('../models/CIS/calendarForApprovedApps');
var _ = require('lodash');


//util must import all approved apps from approvedApps collection with 2015 year activity to apps collection

//find all calendar value with some activity(storage!==0) 
ApprovedCalendar.find({
  storage: {
    $not: {
      $size: 0
    }
  }
})

.exec(function (err, data) {
  //throw err if not nil
  if (err) throw err;
  //start cool stuff here
  _.forEach(data, function (n, key) {
    // console.log("n %s", n);
    ApprovedApps.findById(n.appId, function (err, app) {
      if (err) throw err;
      var privateCheck = false;
      privateCheck = app.applicationId.toString().split("/")[1] ? app.applicationId.toString().split("/")[1] : false;
      if (!privateCheck && n.storage.length !== 0) {
        app.appId += "/private/" + Math.random().toString().slice(2);
        Apps.create(app, function (err, res) {
          if (err) throw err;
          console.log("App %s succesfully imported from approved collection[%s]", res.appName, res.applicationId)
        });
      }
    })
  });

  process.stdin.resume();
  //exit
  process.stdin.on('data', function (key) {
    process.stdout.write("Goodbye!");
    process.exit();
  });

});