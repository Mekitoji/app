var Rate = require('../models/rate');
var mongoose = require('../libs/mongoose')

var id = process.argv[2];
var regionId = process.argv[3]
var month = 11;

Rate.findById(regionId, function(err, data) {
  if (err) return console.error(err);

  data.months.forEach(function(v) {
    // month hardcoded
    if(v.monthNumber === month) {
      var done = false;
      v.apps.forEach(function(app, i) {

        if(app.app == id && !done) {
          done =true;
          console.log("deleting " + app.app);
          deleteApp(app, v, i);
          data.markModified("months")
          data.save(function(err){if(err) return console.error(err)})
          return
        }
      });
    }
  });
});


function deleteApp(appData, monthData, index) {
  // find and delete first in query
  if(appData.status === "Rejected")  {
    monthData.total --
    monthData.fail --
  } else{
    monthData.total --
    monthData.pass --
  }
  monthData.apps.splice(index,1)
}
