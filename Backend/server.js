require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const validateEnv = require("./config/envValidator");
const videoRoutes = require("./routers/videoRoutes");
const authRoutes=require('./routers/authRoutes')

const cors = require("cors");


validateEnv();
connectDB();

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user/videos", videoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});