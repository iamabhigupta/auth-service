/* eslint-disable no-console */
import app from "./app";
import { Config } from "./config";

const startServer = () => {
  const { PORT } = Config;
  try {
    app.listen(PORT, () =>
      console.log(`Listening on PORT: http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error(error);
    process.exit();
  }
};

startServer();
