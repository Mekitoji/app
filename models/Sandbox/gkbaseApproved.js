var mongoose = require('../../libs/mongoose');
var Schema = mongoose.Schema;

// create the model for users and expose it to our app

var approvedApps = new Schema({

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
    type: Number,
  },
  replyTime: {
    type: Number
  },
  resp: {
    type: String
  },
  color: {
    type: String
  },
  applicationId: {
    type: String,
  },
  outdated: {
    type: Boolean,
    default: false
    // true - outdated, false in progress
  }
});

module.exports = mongoose.model('approvedAppsSandbox', approvedApps);