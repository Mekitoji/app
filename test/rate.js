var rate = require('../models/rate');
var should = require('should');
var mongoose = require('mongoose');
var config = require('../config');


describe('Rate', function () {

  before(function () {
    mongoose.connect(config.get('mongoose:uri'), config.get('mongoose: option'));
  });

  it('Rate#createRegion should create new region', function (done) {
    rate.addRegion('Test', function (err) {
      if (err) throw err;
      done();
    });
  });

  it('Rate#getRegion should get region data', function (done) {
    rate.getRegion('Test', function (err) {
      if (err) throw err;
      done();
    });
  });

  it('rate#addMonth should add month to the region', function (done) {
    rate.getRegion('Test', function (err, data) {
      if (err) throw err;
      data.addMonth(0, 2015, function (err) {
        if (err) throw err;
        done();
      });
    });
  });

  it('rate#findMonth should find month if existed in region', function (done) {
    rate.getRegion('Test', function (err, data) {
      if (err) throw err;
      data.findMonth(0, 2015, function (result) {
        should.exist(result);
        done();
      });
    });
  });

  it('rate#findYear should find all month in specified year, and ouput it as Array', function(done) {
    rate.getRegion('Test', function(err, data) {
      if(err) throw err;
      data.findYear(2015, function(res) {
        should.exist(res);
        res.length.should.be.equal(1);
        res.should.be.an.Array();
        done();
      });
    });
  });

  describe('monthSchema\n', function () {
    before(function (done) {
      rate.getRegion('Test', function (err, data) {
        if (err) throw err;
        data.addMonth(1, 2015, function (err, result) {
          should.not.exist(err);
          should.exist(result);
          done();
        });
      });
    });

    it('Virtual variables (rate & month) monthSchema#get', function (done) {
      rate.getRegion('Test', function (err, data) {
        if (err) throw err;
        data.findMonth(0, 2015, function (result) {
          should.exist(result);
          should.exist(result.rate);
          result.rate.should.be.NaN();
          should.exist(result.month);
          result.month.should.be.equal('January');
          done();
        });
      });
    });

    it('monthSchema.addPass() should increment this.total and this.pass and save it', function (done) {
      rate.getRegion('Test', function (err, data) {
        if (err) throw err;
        should.exist(data);
        data.findMonth(1, 2015, function (res) {
          should.exist(res);
          res.pass.should.be.equal(0);
          res.total.should.be.equal(0);
          res.fail.should.be.equal(0);
          res.addPass();
          res.pass.should.be.equal(1);
          res.total.should.be.equal(1);
          res.fail.should.be.equal(0);
          data.save(function (err) {
            if (err) throw err;
            done();
          });
        });
      });
    });
    it('monthSchema#addFail should increment this.total and this.fail and save it', function (done) {
      rate.getRegion('Test', function (err, data) {
        if (err) throw err;
        should.exist(data);
        data.findMonth(1, 2015, function (res) {
          should.exist(res);
          res.pass.should.be.equal(1);
          res.total.should.be.equal(1);
          res.fail.should.be.equal(0);
          res.addFail();
          res.pass.should.be.equal(1);
          res.total.should.be.equal(2);
          res.fail.should.be.equal(1);
          data.save(function (err) {
            if (err) throw err;
            done();
          });
        });
      });
    });
  });

  after(function () {
    rate.remove({
      region: 'Test'
    }, function (err) {
      if (err) throw err;
    });
  });
});