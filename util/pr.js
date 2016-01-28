var Rate = require('../models/rate');
var mongoose = require('../libs/mongoose');
var config = require('../config');
var async = require('async');

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose: option'));

// Rate.addRegion('CIS', function(err) {
//   if(err) throw err;
// });

var actualData = {
  April: {
    monthNumber: 3,
    pass: 13,
    fail: 16
  },
  May: {
    monthNumber: 4,
    pass: 15,
    fail: 8
  },
  June: {
    monthNumber: 5,
    pass: 19,
    fail: 9
  },
  July: {
    monthNumber: 6,
    pass: 8,
    fail: 7
  },
  August: {
    monthNumber: 7,
    pass: 2,
    fail: 2
  },
  September: {
    monthNumber: 8,
    pass: 11,
    fail: 4
  }
};
console.log(Object.keys(actualData));

  Rate.getRegion('CIS', function(err, region) {
    if(err) return cb(err)
    async.eachSeries(Object.keys(actualData), function(n, cb) {
      console.log("start " + n);
      region.findMonth(actualData[n].monthNumber, 2015, function(err, data) {
        if(err) return cb(err);
        console.log(actualData[n]);

        for(var i = 0; i < actualData[n].pass; i++) {
          data.addPass();
        }

        for(var j = 0; j < actualData[n].fail; j++) {
          data.addFail();
        }

        region.markModified('months');
        region.save(function(err) {
          if(err) return cb(err);
          console.log(n + ' ready');
          cb(null);
        });
      });
    }, function(err) {
      if (err) return console.error(err);
    });
  });
