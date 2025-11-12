import axios from "axios";
import nookies from "nookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://122.166.153.170:8084",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token before every request
api.interceptors.request.use((config) => {
  const { token } = nookies.get(null);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;