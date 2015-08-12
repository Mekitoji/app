var rate = require('../models/rate');
var should = require('should');
var mongoose = require('mongoose');
var config = require('../config');


describe('Should work without error', function() {

  before(function() {
    mongoose.connect(config.get('mongoose:uri'), config.get('mongoose: option'));
  });

  it('Should create region', function(done) {
    rate.addRegion('Test', function(err) {
      if (err) throw err;
      done();
    });
  });

  it('Should get region', function(done) {
    rate.getRegion('Test', function(err) {
      if(err) throw err;
      done();
    });
  });

  it('Should add month to the region', function(done) {
    rate.getRegion('Test', function(err, data) {
      if(err) throw err;
      data.addMonth(1, 2015, function(err) {
        if(err) throw err;
        done();
      });
    });
  });

  it('Should find by month', function(done) {
    rate.getRegion('Test', function(err, data) {
      if(err) throw err;
      data.findMonth(1, 2015, function(result) {
        console.log(result.rate);
        if(!result) throw new Error("data not found");
        else return done();
      });
    });
  });

  it('Should remove region', function(done) {
    rate.remove({region: 'Test'}, function(err) {
      if(err) throw err;
      done();
    });
  });
});