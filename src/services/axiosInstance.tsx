// src/utils/axiosInstance.ts
import axios from "axios";
import { CONFIG } from '../config';
const axiosInstance = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 10000, // Optional timeout (10 seconds)
  headers: {
    "Content-Type": "application/json",
    // Add other default headers here if needed
  },
});

console.log("Base URL from .env:", import.meta.env.VITE_BASE_URL);
// Optional: Add request/response interceptors if needed
axiosInstance.interceptors.request.use(
  (config) => {
    const fullUrl = `${import.meta.env.VITE_BASE_URL || ''}${config.url}`;
    console.log(fullUrl);
    const token=localStorage.getItem('token');
    const userdocno=localStorage.getItem('userdocno');
    if(token){
      config.headers['Authorization']=`Bearer ${token}`;
    }
    if (userdocno) {
      // If userdocno exists, add it to a custom header
      config.headers['X-User-Docno'] = userdocno; 
    }
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
