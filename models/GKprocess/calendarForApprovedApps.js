var mongoose = require('../libs/mongoose');
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

module.approvedCalendar = mongoose.model('approvedCalendar', Calendar);
module.approvedCalendarEU = mongoose.model('approvedCalendarEU', Calendar);