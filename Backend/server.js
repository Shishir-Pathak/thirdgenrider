import "dotenv/config";
import connectDB from "./src/config/db.js";
import { createApp } from "./src/app.js";

import { userInit } from "./src/config/initialization.js";

async function start() {
  try {
    await connectDB();
    await userInit();
    console.log("User Initialized");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  const app = createApp();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
