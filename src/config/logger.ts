import winston from "winston";

const logger = winston.createLogger({
   level: "info",
   format: winston.format.json(),
   defaultMeta: { service: "auth-service" },
   transports: [
      new winston.transports.File({
         dirname: "logs",
         filename: "combined.log",
         level: "info",
         silent: false,
      }),
      new winston.transports.File({
         dirname: "logs",
         filename: "error.log",
         level: "error",
         silent: false,
      }),
      new winston.transports.Console({
         level: "info",
         format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
         ),
      }),
   ],
});

// if (process.env.NODE_ENV !== "production") {
//    logger.add(
//       new winston.transports.Console({
//          format: winston.format.simple(),
//       }),
//    );
// }

export default logger;
