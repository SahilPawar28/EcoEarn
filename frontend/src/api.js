import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((requestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
});

export default api;
