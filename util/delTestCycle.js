var mongoose = require('../libs/mongoose');
var TesterStat = require('../models/CIS/testerStat');

var testerName = "AS";
var secondTesterName = "VE"
var appId = "55e70a583218b5d07c849708";

TesterStat.findOne({name: testerName})
.exec(function(err, data) {
  if(err) return console.error(err);
  data.appStorage.forEach(function(v, i) {
    if(v.app == appId) {
      v.testCycleStorage.splice(0, 1);
      console.log(v.testCycleStorage);
      data.markModified('appStorage');
      data.save(function(err) {
        if(err) return console.error(err);
      });
    }
  });
});
