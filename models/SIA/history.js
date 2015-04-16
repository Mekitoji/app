var mongoose = require('../../libs/mongoose');
var Schema = mongoose.Schema;
var Mixed = Schema.Types.Mixed;

var history = new Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  apps: Mixed,
  approvedApps: Mixed,
  calendar: Mixed,
  approvedCalendar: Mixed,
  testerStat: Mixed
});

module.exports = mongoose.model('historySIA', history);