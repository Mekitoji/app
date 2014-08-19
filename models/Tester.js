var mongoose = require('../libs/mongoose');

module.exports = mongoose.model('Tester', {
  tester: {
    type: String
  },
  user: {
    type: String
  },
  testCycles: {
    type: Number
  },
  replyTime: {
    type: Number
  }
})