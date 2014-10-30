var mongoose = require('../libs/mongoose');
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
    unique: true
  },
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // },
  Storage: [testCycleStorage]
});

module.exports = mongoose.model('Tester', Tester);
module.exports = mongoose.model('TesterEU', Tester);