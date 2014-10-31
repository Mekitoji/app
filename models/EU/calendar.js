var mongoose = require('../../libs/mongoose');
var Schema = mongoose.Schema;

var dataStorage = new Schema({
  fullDate: {
    type: String
  },
  value: {
    type: String
  }
});

var Calendar = new Schema({
  appId: {
    type: Schema.ObjectId,
    ref: 'Apps'
  },
  storage: [dataStorage]
});

module.exports = mongoose.model('CalendarEU', Calendar);