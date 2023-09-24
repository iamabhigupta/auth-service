/* eslint-disable no-console */
import app from "./app";
import { Config } from "./config";

const startServer = () => {
   const { PORT } = Config;
   try {
      app.listen(PORT, () => console.log(`Listing on Port:${PORT}`));
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
};

startServer();
