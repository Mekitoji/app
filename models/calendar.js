var mongoose = require('../libs/mongoose');

module.exports = mongoose.model('Calendar', {
  appName: {
    //object appName from 'Apps'
    type: String
  },
  Storage: [{
    date: {
      type: Date
    },
    value: {
      type: String
    }
  }]
});