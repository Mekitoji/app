var mongoose = require('../libs/mongoose');
var Apps = require('../models/CIS/gkbase');
var ApprovedApps = require('../models/CIS/gkbaseApproved');
var Calendar = require('../models/CIS/calendar');
var ApprovedCalendar = require('../models/CIS/calendarForApprovedApps');
var testerStat = require('../models/CIS/testerStat');
var _ = require('lodash');

testerStat.findOne({
  name: "DP"
})

.exec(function (err, tester) {
  if (err) return console.log(err);
  _.forEach(tester.appStorage, function (n, key) {
    if (n.app.toString() === "54b7b57225d5d2824d1a1c89") {

      tester.appStorage.splice(key, 1);
      tester.markModified("appStorage");
      tester.save();
      return return false;
    }
  });
  // tester.markModified("appStorage");
  // tester.save();
});