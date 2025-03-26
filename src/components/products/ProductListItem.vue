<template>
  <div class="col-md-4 mb-4 d-flex justify-content-center">
    <div class="card border-0 shadow-sm h-100 d-flex flex-column" style="width: 25rem">
      <div class="card-img-top-wrapper" style="height: 250px; overflow: hidden">
        <img
          :src="getImageUrl(product.image)"
          class="card-img-top"
          :alt="product.name"
          style="object-fit: contain; width: 100%; height: 100%"
        />
      </div>
      <div class="card-body d-flex flex-column text-center">
        <h5 class="card-title">{{ product.name }}</h5>
        <div class="flex-grow-1"></div>
        <p class="card-text mt-auto"><strong>Price:</strong> €{{ formatPrice(product.price) }}</p>
        <router-link :to="'/products/' + product.id" class="btn button mt-1">
          View Product
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const getImageUrl = (imagePath) => {
  return `/images/${imagePath}`;
};
</script>

<style scoped>
/* Any specific styles for the product item */
</style>
