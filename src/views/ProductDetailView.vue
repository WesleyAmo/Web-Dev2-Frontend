<template>
  <div class="container my-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <!-- Product Content -->
    <template v-if="product">
      <h1 class="text-center mb-4">{{ product.name }}</h1>

      <div class="row mb-5">
        <div class="col-md-6 text-center">
          <div class="image-wrapper" style="aspect-ratio: 16 / 9; overflow: hidden; width: 100%">
            <img
              :src="getImageUrl(product.image)"
              class="img-fluid"
              :alt="product.name"
              style="object-fit: contain; width: 100%; height: 100%"
            />
          </div>
        </div>

        <!-- Product Details -->
        <div class="col-md-6 d-flex flex-column align-items-start justify-content-center">
          <!-- Success Message -->
          <div v-if="successMessage" class="alert alert-success mt-2">
            {{ successMessage }}
          </div>

          <div class="fw-bold mb-3">
            <ul class="list-unstyled">
              <li>
                <h4 class="mb-4">{{ product.name }}</h4>
              </li>
              <li>- Bestellen en betalen</li>
              <li>- Inclusief verzendkosten</li>
              <li>- 30 dagen bedenktijd en gratis retourneren</li>
              <li>- Wettelijke garantie</li>
            </ul>
          </div>

          <div class="d-flex align-items-center">
            <p class="fs-3 mb-0 me-3">€{{ formatPrice(product.price) }}</p>

            <template v-if="isLoggedIn">
              <form @submit.prevent="addToCart" class="d-inline">
                <div class="input-group">
                  <input
                    type="number"
                    v-model.number="quantity"
                    min="1"
                    class="form-control text-center"
                    style="max-width: 80px"
                  />
                  <button type="submit" class="btn button btn-lg">Add to Cart</button>
                </div>
              </form>
            </template>
            <template v-else>
              <router-link to="/login" class="btn button btn-lg">
                Login to Add to Cart
              </router-link>
            </template>
          </div>
        </div>
      </div>

      <!-- Product Description -->
      <div class="row mt-4">
        <div class="col-12">
          <h4>Description</h4>
          <p>{{ product.description }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "../axios-auth";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const authStore = useAuthStore();

const product = ref(null);
const loading = ref(true);
const error = ref(null);
const successMessage = ref(null);
const quantity = ref(1);
const isLoggedIn = ref(false);

const fetchProduct = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Check authentication status
    isLoggedIn.value = !!authStore.user?.id;

    // Fetch product
    const response = await axios.get(`/products/${route.params.id}`);
    product.value = response.data;

    if (route.query.success) {
      successMessage.value = "Product successfully added to cart!";
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load product details";
    console.error("Error fetching product:", err);
  } finally {
    loading.value = false;
  }
};

const addToCart = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) {
      error.value = "You must be logged in to add items to cart";
      return;
    }

    const response = await axios.put(`/cart/add/${product.value.id}`, {
      user_id: userId,
      quantity: quantity.value,
    });

    successMessage.value = "Product added to cart successfully!";
    setTimeout(() => (successMessage.value = null), 3000); // Clear message after 3 seconds
  } catch (err) {
    error.value = err.response?.data?.errorMessage || "Failed to add product to cart";
    console.error("Error adding to cart:", err);
    setTimeout(() => (error.value = null), 3000); // Clear error after 3 seconds
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const getImageUrl = (imagePath) => {
  return `/img/${imagePath}`;
};

onMounted(() => {
  fetchProduct();
});
</script>

<style scoped>
.image-wrapper {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 15px;
}

.alert {
  transition: opacity 0.5s ease;
}

</style>
