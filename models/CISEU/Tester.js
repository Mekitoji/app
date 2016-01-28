//unuse
var mongoose = require('../../libs/mongoose');
var Schema = mongoose.Schema;


var testCycleStorage = new Schema({
  appNameTest: {
    type: String
  },
  date: {
    type: Date
  },
  reason: {
    type: String
  },
});

var Tester = new Schema({
  tester: {
    type: String,
  },
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // },
  Storage: [testCycleStorage]
});

module.exports = mongoose.model('TesterCISEU', Tester);
