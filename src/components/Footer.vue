<script setup>
import { useCategoryStore } from "@/stores/categoryStore";

const categoryStore = useCategoryStore();
</script>

<template>
  <footer class="text-white">
    <div class="container py-5 border-top">
      <div class="row justify-content-center row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        <div
          v-for="category in categoryStore.categories"
          :key="category.id"
          class="col text-center"
        >
          <RouterLink
            :to="'/products?category=' + category.id"
            class="fw-bold text-white text-decoration-none fs-4"
          >
            {{ category.name }}
          </RouterLink>
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
  color: var(--bs-white);
  background-color: rgb(8, 34, 75);
}

footer a {
  color: var(--bs-white);
}

footer a:hover {
  text-decoration: underline;
}
</style>
