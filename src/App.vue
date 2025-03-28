<script setup>
import { RouterView, useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";

const route = useRoute();
const authStore = useAuthStore();

// List of routes that should not show header and footer
const noHeaderFooterRoutes = ["login", "register"];

// Initialize auth when app mounts
onMounted(async () => {
  await authStore.initializeAuth();
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

<style scoped>
#main-content {
  min-height: calc(100vh - 120px); /* Adjust based on header/footer height */
  padding-bottom: 60px; /* Space for footer */
}
</style>
