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
    type: Date,
    default: Date.now
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
    type: String
  },
  replyTime: {
    type: String
  },
  resp: {
    type: String
  },
  appStatus: {
    type: Number
  }
});