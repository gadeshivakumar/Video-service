import axios from "axios";

const API = axios.create({
  baseURL: "https://video-service-1-m2eo.onrender.com/api",
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;