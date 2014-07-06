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
            label: path
        }),
        new(winston.transports.File)({
            filename: 'log/debug.log',
            level: 'debug',
            handleExceptions: true,
            label: path
        })
    ]
});

module.exports = logger;