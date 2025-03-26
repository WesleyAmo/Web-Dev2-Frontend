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
        <!-- Image Gallery -->
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
                    v-model="quantity"
                    min="1"
                    class="form-control text-center"
                    style="max-width: 80px"
                  />
                  <button type="submit" class="btn btn-primary btn-lg">Add to Cart</button>
                </div>
              </form>
            </template>
            <template v-else>
              <p class="text-danger mb-0">Please log in to add to cart.</p>
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
import axios from "../../axios-auth";

const route = useRoute();

const product = ref(null);
const loading = ref(true);
const error = ref(null);
const successMessage = ref(null);
const quantity = ref(1);
const isLoggedIn = ref(false); // Now using local state instead of Vuex

const fetchProduct = async () => {
  try {
    loading.value = true;
    error.value = null;

    // First check authentication status
    await checkAuthStatus();

    // Then fetch product
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

const checkAuthStatus = async () => {
  try {
    const response = await axios.get("/auth/check"); // Adjust to your auth endpoint
    isLoggedIn.value = response.data.authenticated;
  } catch (err) {
    isLoggedIn.value = false;
  }
};

const addToCart = async () => {
  try {
    const response = await axios.post("/cart", {
      // Changed from "/api/cart"
      productId: product.value.id,
      quantity: quantity.value,
    });

    successMessage.value = "Product added to cart successfully!";
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to add product to cart";
    console.error("Error adding to cart:", err);
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const getImageUrl = (imagePath) => {
  return `/images/${imagePath}`; // Adjust if your images are served differently
};

onMounted(() => {
  fetchProduct();
});
</script>

<style scoped>
.image-wrapper {
  background-color: #f8f9fa;
}

/* Keep your existing styles */
</style>
