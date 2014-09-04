var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var Calendar = new Schema({
  appId: {
    type: Schema.ObjectId,
    ref: 'Apps'
  },
  fullDate: {
    type: Date
  },
  value: {
    type: String,
    unique: false,
  }
});

module.exports = mongoose.model('Calendar', Calendar);