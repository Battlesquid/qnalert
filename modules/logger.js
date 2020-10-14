const { createLogger, transports, format, addColors } = require('winston');
const { timestamp, printf, combine, colorize } = format;
const path = require("path");

const timezone = () => new Date().toLocaleString('en-US', { timeZone: 'America/Phoenix' }) 

const logger = createLogger({
    transports: [
        new transports.Console({ level: "notify", format: combine(colorize({ all: true })) }),
        new transports.File({ level: "notify", filename: path.resolve(__dirname, "../logs/info.log") }),
        new transports.File({ level: "error", filename: path.resolve(__dirname, "../logs/error.log") })
    ],
    exceptionHandlers: [
	new transports.File({ filename: path.resolve(__dirname, "../logs/exceptions.log") })
    ],
    format: combine(timestamp({format: timezone}), printf(log => `[${log.timestamp}] | ${log.level.toUpperCase()} | ${log.message}`)),
    levels: {
        error: 0,
        alert: 1,
        info: 2,
        notify: 3
    }
})

addColors({
    error: "red",
    alert: "yellow",
    info: "cyan",
    notify: "green"
})

module.exports = logger;
