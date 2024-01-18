import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import { logger } from "./config/logger";

const startServer = async () => {
  const { PORT } = Config;
  try {
    await AppDataSource.initialize();

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

void startServer();
