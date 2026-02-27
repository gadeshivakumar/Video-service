
const authMiddleware = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  uploadVideo,
  getVideoStatus,
  retryVideo,
  getUserVideos
} = require("../controllers/videoController");


const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, 
});


router.post("/upload", authMiddleware, upload.single("video"), uploadVideo);
router.get("/", authMiddleware, getUserVideos); 
router.get("/:id", authMiddleware, getVideoStatus);
router.post("/:id/retry", authMiddleware, retryVideo);

module.exports = router;