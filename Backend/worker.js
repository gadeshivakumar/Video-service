require("dotenv").config();
const connectDB = require("./config/db");
const validateEnv = require("./config/envValidator");
const { claimJob, processJob } = require("./services/workerService");



validateEnv();
connectDB();

async function startWorker() {
  console.log("Worker started...");

  while (true) {
    const job = await claimJob();

    if (!job) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      continue;
    }

    await processJob(job);
  }
}

startWorker();