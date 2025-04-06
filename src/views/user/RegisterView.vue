<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="card shadow-sm" style="max-width: 400px; width: 100%">
      <div class="card-body">
        <form @submit.prevent="register">
          <h1 class="h3 mb-3 font-weight-normal text-center">Create new account</h1>

          <!-- Error alert -->
          <div v-if="error" class="alert alert-danger text-center">
            {{ error }}
          </div>

          <!-- First Name -->
          <div class="mb-3">
            <label for="inputFirstName" class="form-label">First Name</label>
            <input
              v-model="firstName"
              type="text"
              id="inputFirstName"
              class="form-control"
              placeholder="First Name"
              required
              maxlength="49"
            />
          </div>

          <!-- Last Name -->
          <div class="mb-3">
            <label for="inputLastName" class="form-label">Last Name</label>
            <input
              v-model="lastName"
              type="text"
              id="inputLastName"
              class="form-control"
              placeholder="Last Name"
              required
              maxlength="49"
            />
          </div>

          <!-- Username -->
          <div class="mb-3">
            <label for="inputUsername" class="form-label">Username</label>
            <input
              v-model="username"
              type="text"
              id="inputUsername"
              class="form-control"
              placeholder="Username"
              required
              maxlength="50"
            />
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="inputEmail" class="form-label">Email address</label>
            <input
              v-model="email"
              type="email"
              id="inputEmail"
              class="form-control"
              placeholder="Email address"
              required
              maxlength="49"
            />
          </div>

          <!-- Phone Number -->
          <div class="mb-3">
            <label for="inputPhone" class="form-label">Phone Number</label>
            <input
              v-model="phone"
              type="text"
              id="inputPhone"
              class="form-control"
              placeholder="Phone Number"
              required
              maxlength="10"
            />
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="inputPassword" class="form-label">Password</label>
            <input
              v-model="password"
              type="password"
              id="inputPassword"
              class="form-control"
              placeholder="Password"
              required
              maxlength="50"
            />
          </div>

          <!-- Confirm Password -->
          <div class="mb-3">
            <label for="inputConfirmPassword" class="form-label">Confirm Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              id="inputConfirmPassword"
              class="form-control"
              placeholder="Confirm Password"
              required
              maxlength="50"
            />
          </div>

          <!-- Submit Button -->
          <button class="btn btn-lg btn-primary w-100" type="submit">Register</button>

          <!-- Links -->
          <p class="mt-3 text-center">
            <router-link to="/login">Already have an account? Login instead</router-link>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "../../axios-auth";

const firstName = ref("");
const lastName = ref("");
const username = ref("");
const email = ref("");
const phone = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref(null);

const router = useRouter();

const register = async () => {
  // Frontend validation
  if (
    !firstName.value ||
    !lastName.value ||
    !username.value ||
    !email.value ||
    !phone.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    error.value = "All fields are required.";
    return;
  }

  // Check if the passwords match
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match!";
    return;
  }

  // Check minimum password length (e.g., 8 characters)
  const minPasswordLength = 8;
  if (password.value.length < minPasswordLength) {
    error.value = `Password must be at least ${minPasswordLength} characters long.`;
    return;
  }

  // Validate the email format
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(email.value)) {
    error.value = "Invalid email format.";
    return;
  }

  // Validate the phone number format (assuming 10 digits for example)
  const phonePattern = /^[0-9]{10}$/; // Adjust the regex if needed
  if (!phonePattern.test(phone.value)) {
    error.value = "Invalid phone number format. It should be 10 digits.";
    return;
  }

  try {
    // Send data to your API
    const fullName = `${firstName.value} ${lastName.value}`;
    const response = await axios.post("/user/create", {
      fullName: fullName, // send the fullName
      username: username.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
    });

    // Handle successful registration
    console.log(response.data);
    router.push({
      name: "login",
      query: { successMessage: "Registration successful! Please log in." },
    });
  } catch (err) {
    // Handle error response from API
    error.value = "Registration failed: " + (err.response?.data?.errorMessage || err.errorMessage);
  }
};
</script>

<style scoped>

</style>
