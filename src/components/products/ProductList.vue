<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "../../axios-auth";
import ProductListItem from "./ProductListItem.vue";

const route = useRoute();

// State
const loading = ref(true);
const error = ref(null);
const allProducts = ref([]);
const categories = ref([]);
const currentCategory = ref(null);
const searchQuery = ref(route.query.q || "");
const selectedCategory = ref(route.query.category || "");
const priceSort = ref(route.query.price_sort || "");

const fetchData = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Always fetch categories
    const categoriesResponse = await axios.get("/categories");
    categories.value = categoriesResponse.data;

    // Fetch products based on whether we're searching or not
    if (searchQuery.value) {
      // Use dedicated search endpoint
      const searchResponse = await axios.post("/products/search", {
        searchValue: searchQuery.value,
      });
      allProducts.value = searchResponse.data;
    } else {
      // Regular product fetch with optional category filter
      const productsResponse = await axios.get("/products", {
        params: {
          category: selectedCategory.value,
        },
      });
      allProducts.value = productsResponse.data;
    }

    // Set current category if needed
    if (route.query.category) {
      selectedCategory.value = route.query.category;
      currentCategory.value = categories.value.find((c) => c.id == route.query.category);
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load data";
    console.error("Error fetching data:", err);
  } finally {
    loading.value = false;
  }
};

const filteredProducts = computed(() => {
  let products = [...allProducts.value];

  // If we did a search, the API already filtered for us
  if (!searchQuery.value && selectedCategory.value) {
    // Apply category filter only if not searching
    products = products.filter((p) => p.category_id == selectedCategory.value);
  }

  // Apply price sorting if selected
  if (priceSort.value) {
    products.sort((a, b) => {
      return priceSort.value === "asc" ? a.price - b.price : b.price - a.price;
    });
  }

  return products;
});

// Watch for route changes
watch(
  () => route.query,
  (newQuery) => {
    searchQuery.value = newQuery.q || "";
    selectedCategory.value = newQuery.category || "";
    priceSort.value = newQuery.price_sort || "";
    fetchData();
  },
  { immediate: true }
);

onMounted(() => {
  fetchData();
});

const applyFilters = () => {
  const queryParams = {};
  if (searchQuery.value) queryParams.q = searchQuery.value;
  if (selectedCategory.value) queryParams.category = selectedCategory.value;
  if (priceSort.value) queryParams.price_sort = priceSort.value;

  router.push({ query: queryParams });
};
</script>

<template>
  <div class="container my-4">
    <form @submit.prevent="applyFilters" class="row g-3">
      <div class="col-md-3">
        <label for="price_sort" class="form-label">Sort by Price</label>
        <select class="form-select" v-model="priceSort" id="price_sort">
          <option value="">Default</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
    </form>
    <div class="row mt-5">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="alert alert-danger text-center">
        {{ error }}
      </div>

      <!-- Products -->
      <template v-if="!loading && !error">
        <div v-if="filteredProducts.length > 0" class="row">
          <ProductListItem
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <div v-else class="text-center">
          <p>No products found.</p>
        </div>
      </template>
    </div>
  </div>
</template>
