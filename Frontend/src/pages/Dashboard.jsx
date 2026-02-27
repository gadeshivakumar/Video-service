import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useRef } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [videos, setVideos] = useState([]);
  const fileInputRef=useRef(null);
  const token = localStorage.getItem("token");

  const fetchVideos = async () => {
    const res = await API.get("/user/videos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setVideos(res.data);
  };

  useEffect(() => {
    setInterval(fetchVideos,1000);
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", file);
    setTitle("");
    fileInputRef.current.value = "";
    setFile(null);
    const res = await API.post("/user/videos/upload", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    
    fetchVideos();
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Upload New Video</h3>
      <form onSubmit={handleUpload}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            />
        <button type="submit">Upload</button>
      </form>

      <hr />

      <h3>Your Videos</h3>

      {videos.length === 0 && <p>No videos uploaded yet.</p>}

{videos.map((video) => (
  <div
    key={video._id}
    style={{
      border: "1px solid #ddd",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "6px",
    }}
  >
    <h4>{video.title}</h4>

    <p>
      <strong>Status:</strong> {video.status}
    </p>

    {video.status === "READY" ? (
      <p>
        <strong>Video URL:</strong>{" "}
        <a href={video.finalUrl} target="_blank" rel="noreferrer">
          View Video
        </a>
      </p>
    ) : (
      <p style={{ color: "orange" }}>
        <strong>Video URL:</strong> Pending...
      </p>
    )}

    {video.status === "FAILED" && (
      <p style={{ color: "red" }}>
        Processing failed. Go to details page to retry.
      </p>
    )}
  </div>
))}

      
    </div>
  );
}

export default Dashboard;