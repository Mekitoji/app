var mongoose = require('../libs/mongoose');

// create the model for users and expose it to our app
module.exports = mongoose.model('Apps', {

  country: {
    type: String
  },
  appName: {
    type: String
  },
  category: {
    type: String
  },
  sdpStatus: {
    type: String
  },
  updateTime: {
    type: Date
  },
  seller: {
    type: String
  },
  tv: {
    type: String
  },
  currentStatus: {
    type: String
  },
  testCycles: {
    type: Number
  },
  replyTime: {
    type: Number
  },
  resp: {
    type: String
  },
  currentTester: {
    type: Schema.ObjectId,
    ref: 'Tester'
  },
  outdated: {
    type: Boolean,
    default: false
    // true - outdated, false in progress
  }
});