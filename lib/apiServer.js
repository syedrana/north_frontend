import axios from "axios";

const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, 
  headers: {
    Authorization: process.env.NEXT_PUBLIC_SECURE_API_KEY,
  },
});

export default apiServer;
