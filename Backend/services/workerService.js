const Video = require("../models/Video");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.claimJob = async () => {
  const reclaimTimeout = Number(process.env.WORKER_RECLAIM_TIMEOUT || 300000);
  const timeoutDate = new Date(Date.now() - reclaimTimeout);

  return await Video.findOneAndUpdate(
    {
      status: { $in: ["UPLOADED", "PROCESSING"] },
      $or: [
        { locked: false },
        { lockedAt: { $lt: timeoutDate } } // reclaim stuck job
      ]
    },
    {
      $set: {
        status: "PROCESSING",
        locked: true,
        lockedAt: new Date()
      }
    },
    {
      new: true
    }
  );
};

exports.processJob = async (video) => {
  try {
    console.log(`Processing video ${video._id}`);

    await Video.findByIdAndUpdate(video._id, { progress: 25 });
    await sleep(2000);

    await Video.findByIdAndUpdate(video._id, { progress: 60 });
    await sleep(2000);

    await Video.findByIdAndUpdate(video._id, { progress: 90 });
    await sleep(2000);

    await Video.findByIdAndUpdate(video._id, {
      status: "READY",
      progress: 100,
      finalUrl: video.rawUrl, 
      locked: false,
      lockedAt: null
    });

    console.log(`Video ${video._id} completed successfully`);

  } catch (error) {
    console.error(`Processing failed for ${video._id}:`, error.message);

    await Video.findByIdAndUpdate(video._id, {
      status: "FAILED",
      locked: false,
      lockedAt: null,
      errorMessage: error.message
    });
  }
};