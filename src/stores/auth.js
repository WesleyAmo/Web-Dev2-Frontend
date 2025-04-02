import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "../axios-auth";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const user = ref(null);
  const accessToken = ref(localStorage.getItem("accessToken") || null);
  const refreshToken = ref(localStorage.getItem("refreshToken") || null);
  const loading = ref(false);
  const error = ref(null);
  const initialized = ref(false);

  const isAuthenticated = computed(() => !!accessToken.value);
  const isAdmin = computed(() => user.value?.role === 1);

  // Helper function to store tokens
  const storeTokens = (access, refresh) => {
    accessToken.value = access;
    refreshToken.value = refresh;
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  };

  // Clear all auth data
  const clearAuthData = () => {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // Updated login function
  async function login(credentials) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post("/login", credentials);

      // Store both tokens
      storeTokens(response.data.accessToken, response.data.refreshToken);
      user.value = response.data.user;

      router.push("/");
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.errorMessage || "Login failed. Please try again.";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Refresh token function
  async function refreshTokens() {
    if (!refreshToken.value) {
      logout();
      return null;
    }

    try {
      const response = await axios.post("/refresh-token", {
        refresh_token: refreshToken.value,
      });

      // Store the new tokens
      storeTokens(response.data.accessToken, response.data.refreshToken);
      return response.data;
    } catch (err) {
      // If refresh fails, logout the user
      logout();
      throw err;
    }
  }

  // Updated fetchUser with token refresh handling
  async function fetchUser() {
    if (!accessToken.value) return null;

    try {
      const response = await axios.get("/me");
      user.value = response.data;
      return user.value;
    } catch (err) {
      if (err.response?.status === 401) {
        // Access token expired, try to refresh
        try {
          await refreshTokens();
          // Retry the original request with new token
          const retryResponse = await axios.get("/me");
          user.value = retryResponse.data;
          return user.value;
        } catch (refreshErr) {
          logout();
          throw refreshErr;
        }
      }
      throw err;
    }
  }

  // Updated logout function
  function logout() {
    // Optional: Notify backend to invalidate refresh token
    axios.post("/logout").catch(() => {}); // Fail silently

    clearAuthData();
    router.push("/login");
  }

  // Initialize auth with token refresh check
  async function initializeAuth() {
    if (initialized.value) return;

    if (accessToken.value) {
      try {
        await fetchUser();
      } catch (err) {
        console.error("Auth initialization failed:", err);
      }
    }
    initialized.value = true;
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    refreshTokens,
    fetchUser,
    initializeAuth,
    initialized,
  };
});
