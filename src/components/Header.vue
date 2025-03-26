<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "../axios-auth";

const router = useRouter();
const searchQuery = ref("");

// Simulated authentication state
const user = ref({
  isLoggedIn: true,
  username: "JohnDoe",
  isAdmin: true,
});

const categories = ref([]);

const fetchCategories = async () => {
  try {
    const response = await axios.get("/categories");
    categories.value = response.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery.value.trim()) {
    router.push({
      path: "/products",
      query: { q: searchQuery.value.trim() }, // Pass search query as URL parameter
    });
  } else {
    // If search is empty, navigate to products without search query
    router.push({ path: "/products" });
  }
};

const logout = () => {
  console.log("Logging out...");
  router.push("/login");
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <header class="text-white">
    <!-- Top Bar (Logo & User Menu) -->
    <div
      class="py-3 container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center headerbar"
    >
      <!-- Logo -->
      <div class="text-center text-md-start">
        <RouterLink to="/" class="text-white fs-4 text-decoration-none">ElectroCore</RouterLink>
      </div>

      <!-- User Menu -->
      <ul class="nav mt-2 mt-md-0">
        <!-- ... (keep existing user menu code) ... -->
      </ul>
    </div>

    <!-- Navigation Bar (Categories & Search) -->
    <nav class="py-2 subheader navbar">
      <div
        class="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center"
      >
        <!-- Categories -->
        <ul class="nav">
          <li v-for="category in categories" :key="category.id" class="nav-item">
            <router-link
              :to="{ path: '/products', query: { category: category.id } }"
              class="nav-link text-white px-2"
            >
              {{ category.name }}
            </router-link>
          </li>
        </ul>

        <!-- Search Form -->
        <form @submit="handleSearch" class="d-flex mt-2 mt-md-0">
          <input
            v-model="searchQuery"
            class="form-control me-2"
            type="search"
            placeholder="Search products..."
            aria-label="Search"
          />
          <button class="btn btn-outline-light" type="submit">Search</button>
        </form>
      </div>
    </nav>
  </header>
</template>

<style scoped>
header {
  background-color: rgb(7, 21, 44);
}

.subheader {
  background-color: rgb(8, 34, 75);
}

.navbar,
.headerbar {
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Ensure dropdown is displayed correctly */
@media (min-width: 768px) {
  .navbar,
  .headerbar {
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
</style>
