var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var SdpStats = new Schema({
  id: String,
  status: String,
  region: String,
  subscribers: [{
    type:Schema.ObjectId,
    ref: 'sbcMember'
  }]
});

/**
 * add application to the notification center
 * @method function
 * @param  {string} id     application id
 * @param  {string} status current application status
 * @param  {string} region application region(e.g. CIS<EU<SIA)
 */
SdpStats.static.add = function(id, status, region) {
  this.create({
    id: id,
    status: status,
    region: region
  });
};

/**
 * Subscribe sbc member to the mail notification
 * @method function
 * @param  {string}   sub sbc member id
 * @param  {Function} cb  callback
 */
SdpStats.methods.subscribe = function(sub, cb) {
  var subId = new Schema.ObjectId(sub);
  if(this.subscribers.some(subId)) {
    return new Error('Member already subscribed.');
  }
  this.subcribers.push(subId);
  this.save(cb);
};

/**
 * Unsubscribe sbc member from mail notification
 * @method function
 * @param  {string}   sub sbc memner id
 * @param  {Function} cb  [description]
 */
SdpStats.methods.unsubscribe = function(sub, cb) {
  var subId = new Schema.ObjectId(sub);
  var index =this.subsribers.indexOf(subId);
  if (index >= 0) {
    this.slice(index, 1);
    this.save(cb);
  } else {
    return new Error('Member don\'t subscribed to the notification');
  }
};


module.exports = mongoose.model('Sdp', SdpStats);
