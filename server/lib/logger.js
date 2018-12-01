const expressBunyan = require('express-bunyan-logger');
const bunyan = require('bunyan');
const RotatingFileStream = require('bunyan-rotating-file-stream');
const path = require('path');
const config = require('@project_root/config');

console.log(config);

let bunyanOptions = {
    name: 'svalim',
    streams: [
        {
            stream: new RotatingFileStream({
                path: path.join(config.logsDirectory, '%d-%b-%y.log'),
                period: '1d',          // daily rotation
                totalFiles: 10,        // keep up to 10 back copies
                rotateExisting: true,  // Give ourselves a clean file when we start up, based on period
                threshold: '10m',      // Rotate log files larger than 10 megabytes
            }),
            level: 'info'
        },
    ],
    serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res,
    },
};

// Печатаем логи в консоль если не продакшн
if (config.env === 'dev') {
    bunyanOptions.streams.push({
        stream: process.stdout,
        level: 'debug'
    });
}

module.exports = {
    expressLogger: expressBunyan(bunyanOptions),
    generalLogger: bunyan.createLogger(bunyanOptions)
};
