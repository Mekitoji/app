var mongoose = require('../libs/mongoose');

module.exports = mongoose.model('TestCycle', {
  appName: {
    type: String
  },
  date: {
    type: Date
  },
  reason: {
    type: String
  },
  currentTester: {
    type: String
  }
});