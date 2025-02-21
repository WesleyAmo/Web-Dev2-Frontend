<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Simulated authentication state (replace with Pinia/Vuex or API call)
const user = computed(() => ({
  isLoggedIn: true, // Replace with actual state
  username: "JohnDoe",
  isAdmin: true, // Set to false for normal users
}));

const logout = () => {
  console.log("Logging out...");
  router.push("/login");
};

// Navigation categories (can be replaced with API data)
const navigationData = ref([
  {
    category: "Electronics",
    subcategories: ["Laptops", "Smartphones", "Cameras"],
  },
  {
    category: "Appliances",
    subcategories: ["Refrigerators", "Microwaves", "Air Conditioners"],
  },
]);
</script>

<template>
  <header class="bg-secondary text-white fixed-top">
    <!-- Top Bar (Logo & User Menu) -->
    <div class="py-3 container d-flex justify-content-between align-items-center">
      <RouterLink to="/" class="text-white fs-4 text-decoration-none">ElectroCore</RouterLink>
      <ul class="nav">
        <li v-if="user.isLoggedIn" class="nav-item dropdown">
          <a
            class="nav-link text-white px-2 d-flex align-items-center dropdown-toggle"
            id="userDropdown"
            role="button"
            data-bs-toggle="dropdown"
          >
            <i class="bi bi-person me-2 fs-4"></i>
            <span class="text-decoration-underline">{{ user.username }}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><RouterLink class="dropdown-item" to="/account">Account Details</RouterLink></li>
            <li v-if="user.isAdmin">
              <RouterLink class="dropdown-item" to="/admin/products">Product Management</RouterLink>
            </li>
            <li v-if="user.isAdmin">
              <RouterLink class="dropdown-item" to="/admin/orders">Order Management</RouterLink>
            </li>
            <li><a class="dropdown-item" href="#" @click.prevent="logout">Log out</a></li>
          </ul>
        </li>
        <li class="nav-item" v-if="user.isLoggedIn">
          <RouterLink to="/cart" class="nav-link text-white px-2">
            <i class="bi bi-cart fs-4"></i>
          </RouterLink>
        </li>
        <li v-else class="nav-item">
          <RouterLink to="/login" class="nav-link text-white px-2">Login</RouterLink>
          <RouterLink to="/register" class="nav-link text-white px-2">Sign up</RouterLink>
        </li>
      </ul>
    </div>

    <!-- Navigation Bar (Categories & Search) -->
    <nav class="py-2 text-bg-primary">
      <div class="container d-flex justify-content-between align-items-center">
        <ul class="nav">
          <li v-for="category in navigationData" :key="category.category" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle text-white px-2"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              {{ category.category }}
            </a>
            <ul class="dropdown-menu bg-primary">
              <li>
                <RouterLink
                  :to="'/products?category=' + category.category"
                  class="dropdown-item text-white fw-bold"
                >
                  {{ category.category }}
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li v-for="sub in category.subcategories" :key="sub">
                <RouterLink :to="'/products?subcategory=' + sub" class="dropdown-item text-white">
                  {{ sub }}
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>

        <!-- Search Form -->
        <form action="/products/index" method="GET" class="d-flex">
          <input
            class="form-control me-2"
            type="search"
            name="q"
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
/* Ensure header stays fixed at the top */
header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1030;
}

/* Prevent overlap by adding padding to the page */
main {
  padding-top: 100px; /* Adjust based on header height */
}

/* Show dropdowns on hover */
.nav-item.dropdown:hover .dropdown-menu {
  display: block;
  margin-top: 0;
}

/* Adjust spacing for navigation */
nav {
  width: 100%;
  text-align: left;
}
</style>
