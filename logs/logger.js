import winston from "winston";
import path from "path";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename:"../log/error.log", level: "error" }),
      new winston.transports.File({ filename:"../log/combined.log"}),
    ],
});


export default logger