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
  },
  groups: {
    cis: Boolean,
    eu: Boolean,
  },
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

member.statics.all = function(cb) {
  this.find({})
  .exec(cb);
}

var sbcMember = mongoose.model('sbcMember', member);

module.exports = sbcMember;
