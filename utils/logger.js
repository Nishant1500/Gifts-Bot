const winston = require("winston");
require("winston-daily-rotate-file");

const dashLog = new winston.transports.DailyRotateFile({
  filename: "./erorr_logs/errors-%DATE%.log",
  datePattern: "DD-MM-YYYY",
  zippedArchive: true,
  maxSize: "10k",
});

const dash = winston.createLogger({
  transports: [
    dashLog,
    new winston.transports.Console({
      colorize: true,
    }),
  ],
});

module.exports = dash;
