import axios from "axios";
import { TokenStorage } from "../utils/tokenStorage";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

apiClient.interceptors.request.use((config) => {
  const token = TokenStorage.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
