import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "../axios-auth";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const fetched = ref(false);

  // Store the fetch promise to prevent multiple simultaneous requests
  let fetchPromise = null;

  async function fetchCategories() {
    // If already fetched, return the existing data
    if (fetched.value) {
      return categories.value;
    }

    if (fetchPromise) {
      return fetchPromise;
    }

    loading.value = true;
    error.value = null;

    try {
      fetchPromise = axios.get("/categories");
      const response = await fetchPromise;

      categories.value = response.data;
      fetched.value = true;
      return categories.value;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to load categories";
      throw err;
    } finally {
      loading.value = false;
      fetchPromise = null;
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
  };
});
