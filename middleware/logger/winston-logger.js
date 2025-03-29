import winston from "winston";

const {
    combine,
    timestamp,
    cli,
    json,
    printf,
    uncolorize,
} = winston.format;

// Simple Winston logger to track most events in console and to keep track of errors in log file.
// Can be improved with 'winston-daily-rotate-file' npm library to rotate logs files for errors.
const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
        cli(),
        printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'error-logs.log',
            level: 'error',
            format: combine(
                uncolorize(),
                timestamp({format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
                json(),
            )
        })
    ],
});

export default logger;
