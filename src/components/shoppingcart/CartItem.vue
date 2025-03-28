<template>
  <div class="row mb-4 d-flex justify-content-between align-items-center">
    <div class="col-md-2 col-lg-2 col-xl-2">
      <img
        :src="getImageUrl(item.product.image)"
        class="img-fluid rounded-3"
        :alt="item.product.name"
      />
    </div>
    <div class="col-md-3 col-lg-3 col-xl-3">
      <h6 class="mb-0">{{ item.product.name }}</h6>
    </div>
    <div class="col-md-3 col-lg-3 col-xl-2">
      <input
        v-model.number="item.quantity"
        type="number"
        min="1"
        class="form-control form-control-sm text-center"
        @change="$emit('quantity-change', item)"
      />
    </div>
    <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
      <h6 class="mb-0">€{{ (item.product.price * item.quantity).toFixed(2) }}</h6>
    </div>
    <div class="col-md-1 col-lg-1 col-xl-1 text-end">
      <button @click="$emit('remove', item.product.id)" class="btn btn-link text-danger">
        <i class="bi bi-trash"></i>
      </button>
    </div>
    <hr class="my-4" />
  </div>
</template>

<script>
export default {
  name: "CartItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getImageUrl(imageName) {
      return imageName ? `/img/${imageName}` : "/img/placeholder.jpg";
    },
  },
};
</script>

<style scoped>
.form-control-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
  width: 50px;
  text-align: center;
}

.confirm-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  height: 31px;
  white-space: nowrap;
}

.btn-link {
  text-decoration: none;
}
</style>
