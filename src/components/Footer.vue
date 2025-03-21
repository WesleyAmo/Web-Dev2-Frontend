<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
// Navigation categories (this can be replaced with data fetched from an API)
const navigationData = ref([
  {
    category: "Electronics",
    subcategories: ["Laptops", "Smartphones", "Cameras"],
  },
  {
    category: "Appliances",
    subcategories: ["Refrigerators", "Microwaves", "Air Conditioners"],
  },
  // Add more categories as needed
]);
</script>

<template>
  <footer class="bg-primary text-white">
    <div class="container py-5 mt-5 border-top">
      <div class="row justify-content-center row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        <div v-for="category in navigationData" :key="category.category" class="col text-center">
          <RouterLink
            :to="'/products?category=' + category.category"
            class="fw-bold text-white text-decoration-none fs-4"
          >
            {{ category.category }}
          </RouterLink>
          <ul class="nav flex-column">
            <li
              v-for="subcategory in category.subcategories"
              :key="subcategory"
              class="nav-item mb-2"
            >
              <RouterLink
                :to="'/products?subcategory=' + subcategory"
                class="nav-link p-0 text-white text-decoration-none"
              >
                {{ subcategory }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-12 mt-4 text-center">
          <RouterLink
            to="/"
            class="d-flex justify-content-center align-items-center mb-3 link-body-emphasis text-decoration-none"
          >
            <span class="fw-bold fs-5 text-white">ElectroCore</span>
          </RouterLink>
          <p class="text-white">© 2025</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: var(--bs-primary);
  color: var(--bs-white);
}

footer a {
  color: var(--bs-white);
}

footer a:hover {
  text-decoration: underline;
}
</style>
