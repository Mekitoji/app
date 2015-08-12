var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SdpStats = new Schema({
  id: String,
  status: String
});

module.exports = mongoose.model('Sdp', SdpStats);