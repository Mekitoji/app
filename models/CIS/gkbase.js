var mongoose = require('../../libs/mongoose');
var Schema = mongoose.Schema;


function getCurrentYear() {
  var date = new Date();
  return date.getFullYear();
}

// create the model for users and expose it to our app
var Apps = new Schema({

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
    default: 1
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
  },
  year: {
    type: Number,
    default: getCurrentYear()
  }
});

module.exports = mongoose.model('Apps', Apps);