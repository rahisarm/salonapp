// src/utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.BASE_URL,
  timeout: 10000, // Optional timeout (10 seconds)
  headers: {
    "Content-Type": "application/json",
    // Add other default headers here if needed
  },
});

// Optional: Add request/response interceptors if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before sending the request (e.g., add authorization token)
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Any response transformation here
    return response;
  },
  (error) => {
    // Handle response error
    return Promise.reject(error);
  }
);

export default axiosInstance;
