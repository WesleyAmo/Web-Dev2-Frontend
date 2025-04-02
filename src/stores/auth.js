import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "../axios-auth";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const user = ref(null);
  const token = ref(localStorage.getItem("authToken") || null);
  const loading = ref(false);
  const error = ref(null);
  const initialized = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 1);

  async function login(credentials) {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.post("/login", credentials);
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem("authToken", token.value);
      router.push("/");
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.errorMessage || "Login failed. Please try again.";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return null;
    loading.value = true;
    try {
      const response = await axios.get("/me");
      user.value = response.data;
      return user.value;
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      }
      error.value = "Failed to fetch user data";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("authToken");
    router.push("/login");
  }

  async function initializeAuth() {
    if (initialized.value) return;
    if (token.value) {
      try {
        await fetchUser();
      } catch (err) {
        console.error("Auth initialization failed:", err);
      }
    }
    initialized.value = true;
  }

  const canAccess = (route) => {
    if (route.meta?.requiresAdmin) {
      return isAdmin.value;
    }
    if (route.meta?.requiresAuth) {
      return isAuthenticated.value;
    }
    return true;
  };
  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    fetchUser,
    initializeAuth,
    initialized,
    canAccess,
  };
});
