const path = require("path");
const winston = require("winston");
const { createLogger, transports, format, addColors } = winston;
const { timestamp, printf, combine, json, colorize, padLevels } = format;

const colors = {
    error: "bold underline red",
    alert: "yellow",
    info: "blue",
    notify: "green"
};

const consoleFormat = combine(
    timestamp(),
    colorize({ level: true }),
    padLevels({
        levels: {
            error: 0,
            alert: 1,
            info: 2,
            notify: 3
        }
    }),
    printf(info => `${info.timestamp} | ${info.level} ${info.message}`)
);

const jsonFormat = combine(timestamp(), json());

const logger = createLogger({
    transports: [
        new transports.Console({
            level: "notify",
            format: consoleFormat,
            eol: "\n"
        }),
        new transports.File({
            level: "notify",
            filename: path.resolve(__dirname, "../logs/info.log"),
            format: jsonFormat
        }),
        new transports.File({
            level: "error",
            filename: path.resolve(__dirname, "../logs/error.log"),
            format: jsonFormat
        })
    ],
    exceptionHandlers: [
        new transports.File({
            filename: path.resolve(__dirname, "../logs/exceptions.log"),
            format: jsonFormat
        })
    ],
    format: jsonFormat,
    levels: {
        error: 0,
        alert: 1,
        info: 2,
        notify: 3
    }
});

addColors(colors);

module.exports = logger;
