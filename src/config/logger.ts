import winston from "winston";
import { Config } from ".";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { serviceName: "auth-service" },
  transports: [
    new winston.transports.File({
      dirname: "logs",
      filename: "combined.log",
      level: "info",
      silent: Config.NODE_ENV === "test",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "error",
      silent: Config.NODE_ENV === "test",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      silent: Config.NODE_ENV === "test",
    }),
  ],
});
