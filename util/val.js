var mongoose = require('../libs/mongoose');
var Apps = require('../models/CIS/gkbase');
var ApprovedApps = require('../models/CIS/gkbaseApproved');
var Calendar = require('../models/CIS/calendar');
var ApprovedCalendar = require('../models/CIS/calendarForApprovedApps');
var testerStat = require('../models/CIS/testerStat');
var _ = require('lodash');

testerStat.findOne({
  name: "VE"
})

.exec(function (err, tester) {
  if (err) console.log(err)
  var temp1, temp2;

  _.forEach(tester.appStorage, function (nm, key) {
    if (nm.app.toString() === "54c65be6ac730dcb6b1c682f") {
      temp2 = nm;
      tester.appStorage.splice(key, 1);
      console.log("2")
      tester.markModified("appStorage");
      tester.save();
      testerStat.findOne({
        "name": "AS"
      })

      .exec(function (err, tester) {
        if (err) {
          console.log(err);
        }
        tester.appStorage.push(temp2);
        tester.markModified("appStorage");
        tester.save(function (err, res) {
          if (err) {
            console.log(err);
          }
        })
      })
    }
  });


});
// if (nm.app.toString() === "54c65be6ac730dcb6b1c682f") {
//   temp2 = nm;
//   tester.appStorage.splice(key, 1);
//   console.log("2")
// }