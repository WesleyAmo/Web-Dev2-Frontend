<template>
  <div class="col-lg-4 bg-body-tertiary">
    <div class="p-5">
      <div v-if="cartItems.length > 0">
        <h3 class="fw-bold mb-5 mt-2 pt-1">Summary</h3>
        <hr class="my-4" />
        <div class="d-flex justify-content-between mb-4">
          <h5 class="text-uppercase"><strong>Items:</strong> {{ cartItems.length }}</h5>
          <h5>€{{ subtotal.toFixed(2) }}</h5>
        </div>
        <h5 class="text-uppercase mb-3">Delivery Cost</h5>
        <div class="mb-4 pb-2">
          <h5>€5.00</h5>
        </div>
        <hr class="my-4" />
        <div class="d-flex justify-content-between mb-5">
          <h5 class="text-uppercase">Total Price</h5>
          <h5>€{{ total.toFixed(2) }}</h5>
        </div>
        <button @click="$emit('checkout')" class="btn btn-dark btn-block btn-lg">Checkout</button>
      </div>
      <div v-else class="text-center">
        <h5>No items to summarize.</h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CartSummary",
  props: {
    cartItems: {
      type: Array,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
};
</script>
<style scoped>
.bg-body-tertiary {
  background-color: #f8f9fa !important;
}

.card-registration-2 .bg-body-tertiary {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

@media (max-width: 991px) {
  .card-registration-2 .bg-body-tertiary {
    border-bottom-left-radius: 5px;
    border-top-right-radius: 0;
  }
}

.btn-dark {
  background-color: #212529;
  border-color: #212529;
}

.btn-dark:hover {
  background-color: #424649;
  border-color: #424649;
}
</style>
