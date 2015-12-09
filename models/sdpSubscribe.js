var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var SdpStats = new Schema({
  id: String,
  status: String,
  region: String,
  name: String,
  watch: {
    type: Boolean,
    default: false
  },
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
SdpStats.statics.add = function(id, status, region, name) {
  this.create({
    id: id,
    status: status,
    region: region,
    name: name
  });
};

/**
 * Subscribe sbc member to the mail notification
 * @method function
 * @param  {string}   sub sbc member id
 * @param  {Function} cb  callback
 */
SdpStats.methods.subscribe = function(sub) {
  // var subId = new Schema.ObjectId(sub);
  if(this.subscribers.indexOf(sub) > 0) {
    return new Error('Member already subscribed.');
  }
  if(!this.watch) {
    this.watch = true;
  }
  this.subscribers.push(sub);
  // this.save(cb);
};

/**
 * Unsubscribe sbc member from mail notification
 * @method function
 * @param  {string}   sub sbc memner id
 * @param  {Function} cb  [description]
 */
SdpStats.methods.unsubscribe = function(sub, cb) {
  // var subId = new Schema.ObjectId(sub);
  var index = this.subscribers.indexOf(sub);
  if (index >= 0) {
    this.subscribers.splice(index, 1);
    if(this.subscribers.length === 0) {
      this.watch = false;
    }
    this.markModified('subscribers');
    this.save(cb);
  } else {
    return new Error('User doesn\'t subscribed to the notification');
  }
};

SdpStats.statics.all = function(cb) {
  this.find({})
  .exec(cb);
}

module.exports = mongoose.model('Sdp', SdpStats);
