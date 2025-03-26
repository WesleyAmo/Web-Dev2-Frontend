<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

// Get the current route
const route = useRoute();

// List of routes that should not show header and footer
const noHeaderFooterRoutes = ["login", "register"];
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
