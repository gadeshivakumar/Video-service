const Video = require("../models/Video");

exports.getVideoById = async (id) => {
  return await Video.findById(id);
};

exports.resetVideoForRetry = async (video) => {
  video.status = "UPLOADED";
  video.locked = false;
  video.lockedAt = null;
  video.progress = 0;
  video.errorMessage = null;

  return await video.save();
};