var Rate = require('../models/rate');
var TesterStat = require('../models/CIS/testerStat');
var Apps = require('../models/CIS/gkbase');
var async = require('async');
var Calendar = require('../models/CIS/calendarForApprovedApps');

var result = {};//monthNumber :{pass: {value: number, apps: Array}, fail: {value: number, apps: Array}}

TesterStat.find({})
.populate({
  path: 'appStorage.app',
  model: 'Apps'
})
.exec(function(err, data) {
  if(err) return console.error(err);
  data.forEach(function(v) {
    v.appStorage.forEach(function(d) {
      // continue only with approved apps
      if(d.app.tv =='Approved' || d.app.tv == 'Patrial') {
        var month = new Date(d.app.updateTime).getMonth();
        var year  = new Date(d.app.updateTime).getFullYear();
        // check app year
        if(year === 2015) {
          // if month not found create new
          if(!result[month])
            result[month] = {pass: {value:0, apps:[]} ,fail: {value: 0, apps: []}};
          // if apps with this id current exist in array, skit it.
          if(!result[month].pass.apps.some(function(elem) { return elem == d.app._id; })) {
            // push data to month object and return
            result[month].pass.value++;
            result[month].pass.apps.push(d.app._id);
            checkCalendarById(d.app._id, month);
          }
        }
      }
      d.testCycleStorage.forEach(function(g) {
        var month = new Date(g.date).getMonth();
        var year  = new Date(g.date).getFullYear();
        if(year === 2015) {
          if(!result[month])
            result[month] = {pass: {value:0, apps:[]} ,fail: {value: 0, apps: []}};
          result[month].fail.value++;
          result[month].fail.apps.push(d.app._id);
        }
      });
    });

  });

  setTimeout(function() {
    console.log('Result: ', result);


    var arr = [0,1,2,3,4,5,6,7,8,9];
    async.eachSeries(arr, function(n, cb) {
      Rate.getRegion('CIS', function(err, region) {
        if(err)cb(err);
        region.findMonth(n, 2015, function(err, data) {
          if(err) cb(err);
          for(var i =0; i< result[n].pass.value; i++) {
            data.addPass(result[n].pass.apps[i]);
          }
          for(var j =0; j< result[n].fail.value; j++) {
            data.addFail(result[n].fail.apps[j]);
          }
          region.markModified('months');
          region.save(function(err) {
            if(err) cb(err);
            cb(null);
          });
        });
      });
    }, function(err) {
      if(err) return console.error(err);
    });
  }, 5000);

});


var count = 0;

function checkCalendarById(id, month) {
  Calendar.findOne({appId: id})
  .exec(function(err, data) {
    if(err) return console.error(err);
    var d = data.storage.some(function(elem) { return !elem.value;});
    if(data.storage.length === 0 || d) {
      result[month].pass.value--;
      var index = result[month].pass.apps.indexOf(id);
      result[month].pass.apps.slice(index, 1);
    }
  });
}
