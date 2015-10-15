var sbcMember = require('../models/sbcMember');
var sdp = require('../models/sdp');
var config = require('../config');
var mongoose = require('mongoose');
var should = require('should');

var name = 'Kimchi';
var mail = 'Kimchi1337@faq.com';

describe('sbcMember', function() {
  // before(function () {
  //   mongoose.connect(config.get('mongoose:uri'), config.get('mongoose: option'));
  // });

  describe('Should correctly create and remove sbc member', function() {

    beforeEach(function(done) {
      sbcMember.add(name, mail, function(err) {
        if(err) return console.error(err);
        done();
      });
    });

    it('Should remove sbc member by name', function(done) {
      sbcMember.removeByName(name, function(err) {
        if(err) return console.error(err);
        done();
      });
    });

    it('Should remove sbc member by mail', function(done) {
      sbcMember.removeByMail(mail, function(err) {
        if(err) return console.error(err);
        done();
      });
    });

    it('Should not create a new member if name is exist', function(done) {
      sbcMember.add(name, mail + "samba", function(err) {
        should.exist(err);
        err.should.be.Object();
        done();
      });
    });

    it('Should not create a new mail if name is exist', function(done) {
      sbcMember.add(name + 'samba', mail , function(err) {
        should.exist(err);
        err.should.be.Object();
        done();
      });
    });

    afterEach(function(done) {
      sbcMember.removeByMail(mail, function(err) {
        if(err) return console.error(err);
        done();
      });
    });
  });

});
