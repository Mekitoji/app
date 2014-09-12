var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var testerStorage = new Schema({

  replyTime: {
    type: Number
  },
  testCycle: {
    type: Schema.ObjectId,
    ref: 'TestCycle'
  }
});
var testCycleStorage = new Schema({
  testCycle: {
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