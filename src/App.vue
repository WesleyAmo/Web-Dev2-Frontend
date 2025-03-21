<script setup>
import { RouterLink, RouterView } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div id="app">
    <Header />
    <div id="main-content">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>

<style scoped></style>
