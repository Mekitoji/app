var request = require('request');
var _ = require('lodash');
var data = [];
var url = 'localhost';

request({
  url: url,
  json: true
}, function (error, response, body) {

  if (!error && response.statusCode === 200) {
    // console.log(body) // Print the json response
    _.forEach(body, function (d) {
      if (d.sdpStatus === 'Delete') {
        data.push(d);
      }
    });
  }
})



setTimeout(
  function da() {
    console.log(data._id)
    _.forEach(data, function (z) {
      request({
        method: 'PUT',
        url: url + z._id,
        json: {
          outdated: true
        }
      }, function (error, response, body) {
        if (error) {
          return console.error('upload failed:', error);
        }
        console.log('PUT successful!  Server responded with:', body);
      })
    });
  }, 5000);