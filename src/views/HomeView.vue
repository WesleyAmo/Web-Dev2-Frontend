<template>
  <div class="container-fluid p-0 m-0">
    <!-- Hero Section -->
    <section class="position-relative overflow-hidden" style="height: 60vh">
      <div class="position-absolute w-100 h-100">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
          alt="Hero Background"
          class="w-100 h-100"
          style="object-fit: cover"
        />
      </div>
      <div class="position-absolute w-100 h-100 bg-dark opacity-50"></div>
      <div class="container h-100 d-flex align-items-center justify-content-center text-center">
        <div
          class="p-3 rounded"
          style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px)"
        >
          <div class="text-white">
            <h1 class="display-4 fw-bold mb-3">The Future of Technology Is Here</h1>
            <p class="lead mb-3">
              Discover cutting-edge electronics and innovative solutions for modern living.
            </p>
            <router-link to="/products" class="btn btn-light btn-lg rounded-pill"
              >Shop Now</router-link
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-4">
      <div class="container">
        <div class="text-center mb-3">
          <h2 class="fw-bold">Shop by Category</h2>
          <p class="text-muted">Find products that suit your needs.</p>
        </div>

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

        <!-- Products by Category -->
        <template v-for="category in categories" :key="category.id">
          <div
            v-if="getFeaturedProductsByCategory(category.id).length > 0"
            class="mb-5 text-center"
          >
            <h3 class="fw-bold mb-3">{{ category.name }}</h3>
            <div class="row g-3 d-flex align-items-stretch">
              <ProductListItem
                v-for="product in getFeaturedProductsByCategory(category.id)"
                :key="product.id"
                :product="product"
                class="col-md-4"
              />
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "../axios-auth";
import ProductListItem from "../components/products/ProductListItem.vue";

const products = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchFeaturedProducts = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await axios.get("/products");
    products.value = response.data.filter((product) => product.isFeatured);
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load featured products";
    console.error("Error fetching featured products:", err);
  } finally {
    loading.value = false;
  }
};

// Get unique categories from featured products
const categories = computed(() => {
  const uniqueCategories = {};
  products.value.forEach((product) => {
    if (!uniqueCategories[product.category.id]) {
      uniqueCategories[product.category.id] = product.category;
    }
  });
  return Object.values(uniqueCategories);
});

const getFeaturedProductsByCategory = (categoryId) => {
  return products.value.filter(
    (product) => product.category_id == categoryId && product.isFeatured
  );
};

onMounted(() => {
  fetchFeaturedProducts();
});
</script>

<style scoped>
.card-img-top-wrapper {
  background-color: #f8f9fa; /* Light background for images with transparency */
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
