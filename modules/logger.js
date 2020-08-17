const { createLogger, transports, format } = require('winston');
const winston = require("winston");
const { timestamp, printf, combine, colorize } = format;

const logger = createLogger({
    transports: [
        new transports.Console({ format: colorize({ all: true }), level: "notify" }),
        new transports.File({ filename: "logs/info.log", level: "notify" }),
        new transports.File({ filename: "logs/error.log", level: "error" })
    ],
    format: combine(timestamp(), printf(log => `[${log.timestamp}] | ${log.level.toUpperCase()} | ${log.message}`)),
    levels: {
        error: 0,
        alert: 1,
        info: 2,
        notify: 3
    }
})

winston.addColors({
    error: "red",
    alert: "yellow",
    info: "cyan",
    notify: "green"
})

module.exports = logger;