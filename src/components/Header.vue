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
  <header class="bg-secondary text-white">
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
        <li v-if="user.isLoggedIn" class="nav-item dropdown">
          <a
            class="nav-link text-white px-2 d-flex align-items-center dropdown-toggle"
            id="userDropdown"
            role="button"
            data-bs-toggle="dropdown"
          >
            <span class="text-decoration-underline">{{ user.username }}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end user-dropdown">
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
    <nav class="py-2 text-bg-primary navbar">
      <div
        class="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center"
      >
        <!-- Categories -->
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
            <ul class="dropdown-menu bg-primary category-dropdown">
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
        <form action="/products/index" method="GET" class="d-flex mt-2 mt-md-0">
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
/* Show dropdowns on hover */
.nav-item.dropdown:hover .dropdown-menu {
  display: block;
  margin-top: 0;
}

.navbar,
.headerbar {
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Style for the user dropdown */
.nav-item.dropdown .dropdown-menu.user-dropdown {
  left: auto;
  right: 0;
  max-width: 90vw; /* Optional: To ensure it doesn't overflow */
  overflow-x: auto;
  z-index: 1050; /* Ensure it stays above other content */
}

/* Style for the category dropdown */
.nav-item.dropdown .dropdown-menu.category-dropdown {
  position: absolute;
  left: 0; /* This allows the category menu to expand naturally */
  right: auto;
  max-width: none; /* No width limit for category dropdown */
}

/* Ensure dropdown is displayed correctly */
@media (min-width: 768px) {
  .nav-item .dropdown-menu {
    position: absolute;
  }
}

@media (min-width: 768px) {
  .navbar,
  .headerbar {
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
</style>
