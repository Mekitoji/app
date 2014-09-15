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

module.exports = mongoose.model('Tester', {
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
