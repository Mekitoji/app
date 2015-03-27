var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;
var mixed = Schema.Types.Mixed;

var history = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  apps: [mixed],
  calendar: [mixed],
  testerStat: [mixed]
});

module.exports = mongoose.model('histotyCIS', history);