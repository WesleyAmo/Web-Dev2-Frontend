<script setup>
import { RouterView, useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";
import { useCategoryStore } from "@/stores/categoryStore";

const route = useRoute();
const authStore = useAuthStore();
const categoryStore = useCategoryStore();
// List of routes that should not show header and footer
const noHeaderFooterRoutes = ["login", "register"];

// Initialize auth when app mounts
onMounted(async () => {
  categoryStore.fetchCategories();
  await authStore.initializeAuth();
  console.log(categoryStore);
});
</script>

<template>
  <div id="app">
    <!-- Conditionally render Header and Footer -->
    <Header v-if="!noHeaderFooterRoutes.includes(route.name)" />
    <div id="main-content">
      <RouterView />
    </div>
    <Footer v-if="!noHeaderFooterRoutes.includes(route.name)" />
  </div>
</template>

<style scoped></style>
