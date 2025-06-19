import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // adapte selon ton backend
  headers: {
    "Content-Type": "application/json",  // valeur par défaut
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
