const cloudinary = require("../config/cloudinary");
const Video = require("../models/Video");
const streamifier = require("streamifier");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "video" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

exports.uploadVideo = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    
    const result = await uploadToCloudinary(req.file.buffer);

    
    const video = await Video.create({
    title,
    rawUrl: result.secure_url,
    status: "UPLOADED",
    progress: 0,
    locked: false,
    user: req.user.id,
    });

    res.status(201).json({
      id: video._id,
      status: video.status,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ message: "Video upload failed" });
  }
};

exports.getVideoStatus = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({
      status: video.status,
      progress: video.progress,
      finalUrl: video.finalUrl,
      errorMessage: video.errorMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch status" });
  }
};

exports.retryVideo = async (req, res) => {
  try {
      const video = await Video.findById(req.params.id);
      
      if (!video) {
          return res.status(404).json({ message: "Video not found" });
        }
        
    if (video.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
        }

    if (video.status !== "FAILED") {
      return res
        .status(400)
        .json({ message: "Only FAILED videos can be retried" });
    }

    video.status = "UPLOADED";
    video.locked = false;
    video.lockedAt = null;
    video.progress = 0;
    video.errorMessage = null;

    await video.save();

    res.json({ message: "Video retry initiated" });
  } catch (error) {
    res.status(500).json({ message: "Retry failed" });
  }
};


exports.getUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};