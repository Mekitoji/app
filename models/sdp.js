var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var SdpStats = new Schema({
  id: String,
  status: String,
  subscribers: [{
    type:Schema.ObjectId,
    ref: 'sbcMember'
  }]
});

SdpStats.static.add = function(id, status) {
  this.create({
    id: id,
    status: status
  });
};

SdpStats.methods.subscribe = function(sub, cb) {
  this.subcribers.push(sub);
  this.save(cb);
};

module.exports = mongoose.model('Sdp', SdpStats);
