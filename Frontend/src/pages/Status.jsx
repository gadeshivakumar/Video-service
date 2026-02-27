import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

function Status() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");

      const res = await API.get(`/user/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  const retry = async () => {
    const token = localStorage.getItem("token");
    await API.post(`/user/videos/${id}/retry`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Status: {data.status}</h2>
      <p>Progress: {data.progress}%</p>

      {data.status === "READY" && (
        <a href={data.finalUrl} target="_blank" rel="noreferrer">
          View Video
        </a>
      )}

      {data.status === "FAILED" && (
        <button onClick={retry}>Retry</button>
      )}
    </div>
  );
}

export default Status;