import axios from "axios";
import { useAuthStore } from "@/stores/auth";

// Create axios instance
const instance = axios.create({
  baseURL: "http://localhost", 
});

let isRefreshing = false;
let failedRequests = [];

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken || localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedRequests.push(() => {
            originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
            resolve(instance(originalRequest));
          });
        });
      }

      // Mark as retrying and try refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh tokens
        await authStore.refreshTokens();

        // Retry the original request with new token
        const retryResponse = await instance(originalRequest);
        failedRequests.forEach((prom) => prom());
        failedRequests = [];

        return retryResponse;
      } catch (refreshError) {
        authStore.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default instance;
