const winston = require("winston");

exports.createLogger = function() {
    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.prettyPrint()
        ),
        prettyPrint: true,
        defaultMeta: { service: 'user-service' },
        transports: [
            //
            // - Write to all logs with level `info` and below to `mpi.log` 
            // - Write all logs error (and below) to `error.log`.
            //
            new winston.transports.File({ filename: '/opt/qewd/mapped/mpi-error.log', level: 'error' }),
            new winston.transports.File({ filename: '/opt/qewd/mapped/mpi.log' })
        ]
        });
} 