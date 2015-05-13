require('mocha');
var request = require('supertest');
var server  = require('../bin/www');
var should  = require('should');
// var ObjectId = require('mongoose').Types.ObjectId;
var _id;

describe("Should respone 200", function () {
  var agent = request(server);

  it("Should GET /api/cis/testerStat", function (done) {
    agent
      .get('/api/cis/testerStat')
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it("Should POST /api/cis/testerStat", function (done) {
    agent
      .post('/api/cis/testerStat')
      .send({
        name: 'Tester1',
      })
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        _id = res.body._id;
        done();
      });
  });

  it('Should PUT /api/put/testerStat', function (done) {
    agent
      .put('/api/cis/testerStat/' + _id)
      .send({
        insertNewApp: true,
        _id: "5493d516bb01031c3fbdab3b",
      })
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it('Should PUT /api/put/testerStat in other way', function (done) {
    agent
      .put('/api/cis/testerStat/' + _id)
      .send({
        insertNewApp: false,
        appId: "5493d516bb01031c3fbdab3b",
        date: new Date(),
        reason: "String!"
      })
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });


  it("Should DELETE /api/cis/testerStat", function (done) {
    agent
      .del('/api/cis/testerStat/' + _id)
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});