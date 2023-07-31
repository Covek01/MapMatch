import axios from "axios";
import { lsGetToken } from "./localStorage";


export const axiosInstance = axios.create({
  baseURL: `https://localhost:7229/api`,
  headers: {
    "Content-type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = lsGetToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status == "401") {
      window.location.href = "/";
    } else if (error.response.status == "403") {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
