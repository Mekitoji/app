var winston = require('winston');
var path = module.filename.split('/').slice(-2).join('/');

//2 transport 
// output in console and file
var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      colorize: true,
      level: 'debug',
      handleExceptions: true,
      timestamp: true
    }),
    new(winston.transports.File)({
      filename: 'log/debug.log',
      level: 'debug',
      handleExceptions: true
    })
  ]
});

module.exports = logger;