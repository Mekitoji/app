var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var member = new Schema({
  name: {
    unique: true,
    type: String
  },
  mail: {
    unique: true,
    type: String
  }
});


member.statics.add = function(name, mail, cb) {
    this.create({
    name: name,
    mail: mail
  }, cb);
};

member.statics.removeByName = function(name, cb) {
  this.findOneAndRemove({
    name: name
  }, cb);
};

member.statics.removeByMail = function(mail, cb) {
  this.findOneAndRemove({
    mail: mail
  }, cb);
};

var sbcMember = mongoose.model('sbcMember', member);

module.exports = sbcMember;
