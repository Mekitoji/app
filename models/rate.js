var mongoose = require('mongoose');
var async = require('async');
var Schema = mongoose.Schema;
//TODO: REWRITE for  new version

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
  },
  apps: Array
});

monthSchema.virtual('rate').get(function() {
  return (this.total/this.pass) * 100;
});

monthSchema.virtual('month').get(function() {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[this.monthNumber] ;
});

monthSchema.method('getList', function() {
  return this.apps;
});

monthSchema.method('addPass', function(id) {
  if(id) {
    this.apps.push({
      app: id,
      status: 'Approved'
    });
  }
  this.total++;
  this.pass++;
  return;
});

monthSchema.method('addFail', function(id) {
  if(id) {
    this.apps.push({
      app: id,
      status: 'Rejected'
    });
  }
  this.total++;
  this.fail++;
  return;
});

var rateSchema = new Schema({
  region: String,
  months: [monthSchema]
});

rateSchema.methods.findMonth = function(month, year, cb) {
  var self = this;

  // this.months.forEach(function(val) {
  //   if(val.year === year && val.monthNumber === month) {
  //     exist = true;
  //     return cb(null, val);
  //   }
  // });
  // if(!exist)  {
  //   self.addMonth(month, year, cb);
  // }

  var exist = false;
  async.each(this.months, function(val, callback) {
    if(val.year === year && val.monthNumber === month) {
      exist = true;
      cb(null, val);
      return callback();
    } else {
      callback();
    }
  }, function(err) {
    if(err) console.error(err);
    if(!exist) {
      self.addMonth(month, year, cb);
    }
  });
};

rateSchema.methods.findYear = function(year, cb) {
  var result = [];
  this.months.forEach(function(val) {
    if(val.year === year) {
      result.push(val);
    }
  });
  return cb(result);
};

rateSchema.methods.addMonth = function(month, year, cb) {
  var self = this;
  var m = new Month({year: year, monthNumber: month});
  this.months.push(m);
  this.save(function(err) {
      if(err) return cb(err);
      return self.findMonth(month, year, cb);
  });
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
    } else cb(null, data);
  });
};

var Month = mongoose.model('Month', monthSchema);
var Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;