var Rate = require('../models/rate');
var mongoose = require('mongoose');
var config = require('../config');
mongoose.connect(config.get('mongoose:uri'), config.get('mongoose: option'));

Rate.getRegion('CIS', function(err,data){
  if(err) return console.error(err);
  var arr = [ 3, 4, 5, 6, 7, 8];
  arr.forEach(function(v) {
    data.addMonth(v, 2015, function(err) {
      if(err) return console.error(err);
    });
  });
});
