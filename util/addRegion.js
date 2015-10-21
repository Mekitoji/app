var Rate = require('../models/rate');
var mongoose = require('mongoose');
var config = require('../config');
    mongoose.connect(config.get('mongoose:uri'), config.get('mongoose: option'));



Rate.addRegion('CIS', function(err){
  if(err) return console.error(err);
});
