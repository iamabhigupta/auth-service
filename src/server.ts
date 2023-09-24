/* eslint-disable no-console */
import app from "./app";
import { Config } from "./config";
import logger from "./config/logger";

const startServer = () => {
   const { PORT } = Config;
   try {
      throw new Error();
      app.listen(PORT, () => logger.info(`Listing on Port:${PORT}`));
   } catch (err: unknown) {
      if (err instanceof Error) {
         logger.error(err.message);
         setTimeout(() => {
            process.exit(1);
         }, 1000);
      }
   }
};

startServer();
