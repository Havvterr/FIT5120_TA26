/* eslint-disable */
import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "/api", // Use relative path, will be handled by Vue's proxy
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
