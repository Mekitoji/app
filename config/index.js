var nconf = require('nconf');
var path = require('path');

nconf.argv()
  .env()
  .file({
    file: path.join(__dirname, 'config.json')
  });
console.log('Server start with this config:');
console.log('NODE_ENV: ' + nconf.get('NODE_ENV'));
console.log('port: ' + nconf.get('port'));

module.exports = nconf;