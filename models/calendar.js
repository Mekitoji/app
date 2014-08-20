var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var dateStorage = new Schema({
  day: {
    type: String,
    unique: false,
  },
  month: {
    type: String,
    unique: false,
  },
  year: {
    type: String,
    unique: false,
  },
  value: {
    type: String,
    unique: false,
  }
});

var Calendar = new Schema({
  appId: {
    type: Schema.ObjectId,
    ref: 'Apps'
  },
  appName: {
    type: String
  },
  storage: [dateStorage]
});

module.exports = mongoose.model('Calendar', Calendar);