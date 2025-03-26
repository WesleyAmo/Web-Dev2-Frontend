<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow-sm" style="max-width: 400px; width: 100%">
      <div class="card-body">
        <form @submit.prevent="login">
          <h1 class="h3 mb-3 font-weight-normal text-center">Please sign in</h1>

          <!-- Display success message -->
          <div v-if="successMessage" class="alert alert-success text-center">
            {{ successMessage }}
          </div>
          <!-- Display error message -->
          <div v-if="error" class="alert alert-danger text-center">
            {{ error }}
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
import { useRouter, useRoute } from "vue-router"; // Import useRouter and useRoute
import axios from "../axios-auth";

const email = ref("");
const password = ref("");
const error = ref(null);
const successMessage = ref(null);

const router = useRouter();
const route = useRoute(); // Get the route to access query parameters

onMounted(() => {
  // Check if there is a successMessage in the query params
  if (route.query.successMessage) {
    successMessage.value = route.query.successMessage;
  }
});

const login = async () => {
  // Frontend validation
  if (!email.value || !password.value) {
    error.value = "Both email and password are required.";
    return;
  }

  try {
    // Send login data to your API
    const response = await axios.post("/login", {
      email: email.value,
      password: password.value,
    });

    // Store the JWT in localStorage (or sessionStorage)
    const token = response.data.token; // Assuming token is returned in response.data.token
    if (token) {
      localStorage.setItem("authToken", token); // Store token in localStorage
    }

    // Optionally, handle success message for login if needed
    router.push("/"); // Redirect to dashboard or home page after successful login
  } catch (err) {
    // Handle error response from API
    error.value = err.response?.data?.errorMessage || err.errorMessage;
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
