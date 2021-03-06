var mongoose = require('../../libs/mongoose');
var Schema = mongoose.Schema;

var TesterStat = new Schema({
  name: {
    type: String,
    unique: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  appStorage: [appStorage], //store array of app
});


var appStorage = new Schema({
  app: {
    type: Schema.ObjectId,
    ref: 'AppsEU'
  },
  year: {
    type: Number
  },
  testCycle: {
    type: Number // test cycle of current app
  },
  respTime: {
    type: Number //response time for current app
  },
  respStorage: [respStorage],
  storage: [testCycleStorage] //contain info about testCycle of current app
});

var respStorage = new Schema({
  fullDate: String,
  value: String,
});

var testCycleStorage = new Schema({
  date: {
    type: Date
  },
  reason: {
    type: String
  },
});

module.exports = mongoose.model('TesterStatSandbox', TesterStat);