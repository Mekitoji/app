var mongoose = require('../libs/mongoose');

// define the schema for our app model
var appBase = mongoose.Schema({

  no: {
    type: Number,
    require: true
  },
  country: {
    type: String,
    require: true
  },
  appName: {
    type: String,
    require: true
  },
  Category: {
    type: String,
    require: true
  },
  sdpStatus: {
    type: String,
    require: true
  },
  updateTime: {
    type: Date,
    require: true
    default: Date.now
  },
  seller: {
    type: String,
    require: true
  },
  tv: {
    type: String,
    require: true
  },
  currentStatus: {
    type: String,
    require: true
  },
  testCycles: {
    type: String,
    require: true
  },
  replyTime: {
    type: String
  },
  resp: {
    type: String,
    require: true
  }
});


// create the model for users and expose it to our app
module.exports = mongoose.model('apps', appBase);