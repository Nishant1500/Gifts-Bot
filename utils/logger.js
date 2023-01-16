const winston = require("winston");
require("winston-daily-rotate-file");

const dashLog = new winston.transports.DailyRotateFile({
  filename: "./error_logs/errors-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "10k",
  maxFiles: '3'
});
const interactionLog = new winston.transports.DailyRotateFile({
  filename: "./interaction_logs/interaction-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "1m",
  maxFiles: "3d"
});

const logErr = winston.createLogger({
  transports: [
    dashLog,
    new winston.transports.Console({
      colorize: true,
    }),
  ],
});

const log = winston.createLogger({
  transports: [
    interactionLog,
  ],
});

module.exports = {
  logErr,
  log
};
