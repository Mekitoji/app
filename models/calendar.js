var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

// var childSchema = new Schema({
//   date: {
//     type: Date
//   },
//   value: {
//     type: String
//   }
// });

// parentSchema = new Schema({
//   appName: {
//     //object appName from 'Apps'
//     type: String
//   },
//   Storage: [childSchema]
// });

var dateStorage = new Schema({
  date: {
    type: String,
    unique: true
  },
  value: {
    type: String,
  }
});

var Calendar = new Schema({
  appName: {
    type: Schema.ObjectId,
    ref: 'Apps'
  },
  storage: [dateStorage]
});

module.exports = mongoose.model('Calendar', Calendar);