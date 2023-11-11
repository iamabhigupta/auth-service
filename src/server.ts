import app from "./app";
import { Config } from "./config";
import { logger } from "./config/logger";

const startServer = () => {
  const { PORT } = Config;
  try {
    app.listen(PORT, () =>
      logger.info(`Listening on PORT: http://localhost:${PORT}`),
    );
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }

    setTimeout(() => {
      process.exit();
    }, 1000);
  }
};

startServer();
