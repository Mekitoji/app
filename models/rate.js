var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var monthSchema = new Schema({
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
});

monthSchema.virtual('rate').get(function() {
  return (this.total/this.pass) * 100;
});

monthSchema.virtual('month').get(function() {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[this.monthNumber] ;
});

monthSchema.method('addPass', function() {
  this.total++;
  this.pass++;
  return;
});

monthSchema.method('addFail', function() {
  this.total++;
  this.fail++;
  return;
});

var rateSchema = new Schema({
  region: String,
  months: [monthSchema]
});

rateSchema.methods.findMonth = function(month, year, cb) {
  var exist = false;
  this.months.forEach(function(val) {
    if(val.year === year && val.monthNumber === month) {
      exist = true;
      return cb(val);
    }
  });
  if(!exist) return cb(null);
};

rateSchema.methods.addMonth = function(month, year, cb) {
  var m = new Month({year: year, monthNumber: month});
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
    if(err) return cb(err);
    if(!data) {
      var e =  new Error("This region not exist.");
      cb(e);
    } else cb(err, data);
  });
};

var Month = mongoose.model('Month', monthSchema);
var Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;