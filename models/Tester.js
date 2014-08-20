var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var testerStorage = new Schema({
  testCycles: {
    type: Number
  },
  replyTime: {
    type: Number
  },
  testCycleReason: {
    type: Schema.ObjectId,
    ref: 'TestCycle'
  }
});

module.exports = mongoose.model('Tester', {
  tester: {
    type: String,
    unique: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  Storage: [testerStorage]
});