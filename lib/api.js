import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    else {
      config.headers.Authorization =
        process.env.NEXT_PUBLIC_SECURE_API_KEY;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
