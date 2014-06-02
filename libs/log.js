var winston = require('winston');


//2 transport 
// output in console and file
var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            colorize: true,
            level: 'debug',
            handleExceptions: true
        }),
        new(winston.transports.File)({
            filename: 'log/debug.log',
            level: 'debug',
            handleExceptions: true
        })
    ]
});

module.exports = logger;