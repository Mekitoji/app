var rate = require('../models/rate');
var should = require('should');
var mongoose = require('mongoose');
var config = require('../config');


describe('Rate', function () {

  before(function () {
    mongoose.connect(config.get('mongoose:uri'), config.get('mongoose: option'));
  });

  it('Rate#createRegion', function (done) {
    rate.addRegion('Test', function (err) {
      if (err) throw err;
      done();
    });
  });

  it('Rate#getRegion', function (done) {
    rate.getRegion('Test', function (err) {
      if (err) throw err;
      done();
    });
  });

  it('rate#addMonth', function (done) {
    rate.getRegion('Test', function (err, data) {
      if (err) throw err;
      data.addMonth(0, 2015, function (err) {
        if (err) throw err;
        done();
      });
    });
  });

  it('rate#findMonth', function (done) {
    rate.getRegion('Test', function (err, data) {
      if (err) throw err;
      data.findMonth(0, 2015, function (result) {
        should.exist(result);
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

    it('Virtual variables monthSchema#get', function (done) {
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

    it('monthSchema#addPass', function (done) {
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
    it('monthSchema#addFail', function (done) {
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