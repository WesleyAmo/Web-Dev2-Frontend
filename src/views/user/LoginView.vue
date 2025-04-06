<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow-sm" style="max-width: 400px; width: 100%">
      <div class="card-body">
        <form @submit.prevent="login">
          <h1 class="h3 mb-3 font-weight-normal text-center">Please sign in</h1>
          <div v-if="successMessage" class="alert alert-success text-center">
            {{ successMessage }}
          </div>
          <div v-if="authStore.error" class="alert alert-danger text-center">
            {{ authStore.error }}
          </div>

          <div class="mb-3">
            <label for="inputEmail" class="form-label">Email address</label>
            <input
              type="email"
              id="inputEmail"
              v-model="email"
              class="form-control"
              placeholder="Email address"
              required
              autofocus
            />
          </div>

          <div class="mb-3">
            <label for="inputPassword" class="form-label">Password</label>
            <input
              type="password"
              id="inputPassword"
              v-model="password"
              class="form-control"
              placeholder="Password"
              required
            />
          </div>

          <button class="btn btn-lg button w-100" type="submit">Sign in</button>

          <p class="mt-3 text-center">
            <router-link to="/register">Don't have an account? Register here</router-link>
          </p>
          <p class="mt-3 text-center">
            <router-link to="/">Back to Home</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const email = ref("");
const password = ref("");
const successMessage = ref(null);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  if (route.query.successMessage) {
    successMessage.value = route.query.successMessage;
  }
});

const login = async () => {
  if (!email.value || !password.value) {
    authStore.error = "Both email and password are required.";
    return;
  }

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
  } catch (err) {
    // Error is already handled in the store
  }
};
</script>

<style scoped>

</style>
