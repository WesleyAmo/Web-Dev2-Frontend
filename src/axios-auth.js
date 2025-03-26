import axios from "axios";

// Add the token to the request headers
const instance = axios.create({
  baseURL: "http://localhost", // Replace with your API base URL
});

instance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("authToken");

    // If the token exists, attach it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
