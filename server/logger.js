const winston = require('winston');

const { createLogger, format, transports } = winston;
const { combine, timestamp, splat, printf} = format

const myFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),splat(), myFormat),

    transports: [
        new winston.transports.Console()
    ]
});

module.exports = logger;
