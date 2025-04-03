<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "../axios-auth";
import { useAuthStore } from "@/stores/auth";
import { useCategoryStore } from "@/stores/categoryStore";

const router = useRouter();
const searchQuery = ref("");
const authStore = useAuthStore();
const showDropdown = ref(false);

const categoryStore = useCategoryStore();

const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery.value.trim()) {
    router.push({
      path: "/products",
      query: { q: searchQuery.value.trim() },
    });
  } else {
    router.push({ path: "/products" });
  }
};

const logout = () => {
  authStore.logout();
  showDropdown.value = false;
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

onMounted(() => {
  authStore.initializeAuth();
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
      <ul class="nav mt-2 mt-md-0 align-items-center">
        <!-- Show login/register when not authenticated -->
        <template v-if="!authStore.isAuthenticated">
          <li class="nav-item">
            <RouterLink to="/login" class="nav-link text-white">Login</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/register" class="nav-link text-white">Register</RouterLink>
          </li>
        </template>

        <!-- Show user dropdown and cart when authenticated -->
        <template v-else>
          <!-- Cart Icon -->
          <li class="nav-item me-3">
            <RouterLink to="/cart" class="nav-link text-white position-relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-cart"
                viewBox="0 0 16 16"
              >
                <path
                  d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                />
              </svg>
              <!-- Optional: Add badge for cart items count -->
              <span v-if="false" <!-- Replace with actual cart item count logic -->
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill
                bg-danger" >
                <!-- {{ cartItemCount }} -->
              </span>
            </RouterLink>
          </li>

          <!-- User Dropdown -->
          <li class="nav-item dropdown">
            <a
              href="#"
              class="nav-link dropdown-toggle text-white d-flex align-items-center"
              @click.prevent="toggleDropdown"
              :aria-expanded="showDropdown"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-person-circle me-1"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fill-rule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
              {{ authStore.user?.username || "Account" }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" :class="{ show: showDropdown }" @click.stop>
              <li>
                <RouterLink to="/my-account" class="dropdown-item" @click="showDropdown = false">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-person me-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"
                    />
                  </svg>
                  Profile
                </RouterLink>
              </li>
              <li v-if="authStore.isAdmin">
                <RouterLink
                  to="/productmanagement"
                  class="dropdown-item"
                  @click="showDropdown = false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-shield-lock me-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"
                    />
                    <path
                      d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z"
                    />
                  </svg>
                  Product Management
                </RouterLink>
              </li>
              <li v-if="authStore.isAdmin">
                <RouterLink to="/orders" class="dropdown-item" @click="showDropdown = false">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-bag me-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"
                    />
                  </svg>
                  Order Management
                </RouterLink>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a href="#" class="dropdown-item" @click="logout">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-box-arrow-right me-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                    />
                  </svg>
                  Logout
                </a>
              </li>
            </ul>
          </li>
        </template>
      </ul>
    </div>

    <!-- Navigation Bar (Categories & Search) -->
    <nav class="py-2 subheader navbar">
      <div
        class="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center"
      >
        <!-- Categories -->
        <ul class="nav">
          <li v-for="category in categoryStore.categories" :key="category.id" class="nav-item">
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

/* Dropdown styles */
.dropdown-menu {
  position: absolute;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
  z-index: 1000;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
}

.dropdown-item {
  color: #212529;
  padding: 0.5rem 1.5rem;
  display: flex;
  align-items: center;
  font-weight: 400;
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #16181b;
}

.dropdown-divider {
  height: 0;
  margin: 0.5rem 0;
  overflow: hidden;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
}

/* Cart badge */
.badge {
  font-size: 0.6rem;
  padding: 0.2em 0.4em;
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
