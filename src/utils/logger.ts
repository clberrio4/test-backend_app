import { func } from "joi";
import { createLogger, transports, format } from "winston";

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    const utc = new Date(timestamp);
    const date =
        utc.getFullYear() +
        "-" +
        (utc.getMonth() + 1) +
        "-" +
        utc.getDate() +
        " " +
        utc.getHours() +
        ":" +
        utc.getMinutes() +
        ":" +
        utc.getSeconds();
    const type = typeof message;
    return `[${level}] [${date}] [${type === "object" ? JSON.stringify(message) : message
        }]`;
});

export const logger = createLogger({
    format: combine(label({ label: "ok" }), timestamp(), myFormat),
    transports: [
        new transports.Console({
            level: "debug",
            handleExceptions: true,

        }),
        new transports.File({
            level: "info",
            handleExceptions: true,
            maxsize: 51200,
            maxFiles: 10,
            filename: `${__dirname}/../logs/logger.log`
        })
    ]
});

