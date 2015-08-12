var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rateSchema = new Schema({
  region: String,
  months: [{
  year: Number,
  monthNumber: Number,
  total: {
    default: 0,
    type: Number
  },
  pass: {
    default: 0,
    type: Number
  },
  fail: {
    default: 0,
    type: Number
  }
}]
});

/*rateSchema.virtual('months.rate').get(function() {
  return (this.total/this.pass) * 100;
});

rateSchema.virtual('months.month').get(function() {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[this.monthNumber];
});

rateSchema.method('addPass', function() {
  this.total++;
  this.pass++;
  // is this save global schema?
  this.save(function(err) {
    if(err) return err;
  });
});

rateSchema.method('addFail', function() {
  this.total++;
  this.fail++;
  this.save(function(err) {
    if(err) return err;
  });
});*/

rateSchema.methods.findMonth = function(month, year, cb) {
  this.months.forEach(function(val) {
    if(val.year === year && val.monthNumber === month) return cb(val);
    else return cb(null);
  });
};

rateSchema.methods.addMonth = function(month, year, cb) {
  var m = {year: year, monthNumber: month};
  this.months.push(m);
  this.save(cb);
};

rateSchema.statics.addRegion = function(region, cb) {
  var self = this;
  self.findOne({region: region}, function(err, data) {
    if(err) cb(err);
    if(!data) {
      self.create({region: region}, cb);
    } else {
      var e = new Error("This region already exist.");
      cb(e);
    }
  });
};

rateSchema.statics.getRegion = function(region, cb) {
  this.findOne({region:region}, function(err, data) {
    if(err) cb(err);
    if(!data) {
      var e =  new Error("This region not exist.");
      cb(e);
    } else cb(err, data);
  });
};



var Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;