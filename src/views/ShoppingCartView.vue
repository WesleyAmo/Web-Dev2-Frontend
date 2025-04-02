<template>
  <section class="h-100 h-custom min-vh-60">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12">
          <div
            class="card card-registration card-registration-2 bg-light"
            style="border-radius: 5px"
          >
            <div class="card-body p-0">
              <div class="row g-0">
                <div class="col-lg-8">
                  <div class="p-5">
                    <div v-if="isLoading" class="text-center py-4">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>

                    <template v-else>
                      <div class="d-flex justify-content-between align-items-center mb-5">
                        <h1 class="fw-bold mb-0">Shopping Cart</h1>
                        <h6 class="mb-0 text-muted">{{ cartItems.length }} items</h6>
                      </div>
                      <hr class="my-4" />

                      <div v-if="cartItems.length === 0" class="text-center">
                        <h5>Your shopping cart is empty.</h5>
                        <p>Start adding items to your cart to see them here.</p>
                        <router-link to="/products" class="btn btn-primary">Go to Shop</router-link>
                      </div>

                      <div v-else>
                        <CartItem
                          v-for="item in cartItems"
                          :key="item.product.id"
                          :item="item"
                          @quantity-change="updateQuantity"
                          @remove="removeItem"
                        />
                      </div>

                      <div class="pt-5">
                        <h6 class="mb-0">
                          <router-link to="/products" class="text-body">Back to shop</router-link>
                        </h6>
                      </div>
                    </template>
                  </div>
                </div>

                <CartSummary
                  v-if="!isLoading && cartItems.length > 0"
                  :cart-items="cartItems"
                  :subtotal="subtotal"
                  :total="total"
                  @checkout="checkout"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "../axios-auth";
import { useAuthStore } from "@/stores/auth";
import CartItem from "@/components/shoppingcart/CartItem.vue";
import CartSummary from "@/components/shoppingcart/CartSummary.vue";
import { watch } from "vue";

export default {
  name: "CartPage",
  components: {
    CartItem,
    CartSummary,
  },
  data() {
    return {
      cartItems: [],
      isLoading: false,
      error: null,
      authReady: false,
    };
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((total, item) => {
        return total + parseFloat(item.product.price) * item.quantity;
      }, 0);
    },
    total() {
      return this.subtotal + 5.0;
    },
  },
  methods: {
    async fetchCart() {
      try {
        this.isLoading = true;
        const authStore = useAuthStore();

        if (!authStore.isAuthenticated) {
          this.cartItems = [];
          return;
        }

        const response = await axios.get(`/cart/${authStore.user.id}`);
        this.cartItems = response.data;
      } catch (error) {
        console.error("Error loading cart:", error);
        this.error = "Failed to load cart";
      } finally {
        this.isLoading = false;
      }
    },
    async updateQuantity(item) {
      try {
        const authStore = useAuthStore();
        // Optimistic update - update UI first
        const originalQuantity = item.quantity;
        item.quantity = Math.max(1, item.quantity); // Ensure quantity is at least 1

        await axios.put(`/cart/update/${item.product.id}`, {
          user_id: authStore.user.id,
          quantity: item.quantity,
        });

        // Only fetch if something might be out of sync
        if (this.cartItems.some((i) => i.pendingUpdate)) {
          await this.fetchCart();
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        // Revert on error
        item.quantity = originalQuantity;
        this.error = "Failed to update quantity";
      }
    },
    async removeItem(productId) {
      try {
        // Optimistic update - remove from UI first
        const itemIndex = this.cartItems.findIndex((item) => item.product.id === productId);
        if (itemIndex === -1) return;

        const removedItem = this.cartItems.splice(itemIndex, 1)[0];

        const authStore = useAuthStore();
        await axios.delete(`/cart/removeproduct/${productId}`, {
          data: { user_id: authStore.user.id },
        });

        // Verify with server if needed
        if (this.cartItems.some((i) => i.pendingUpdate)) {
          await this.fetchCart();
        }
      } catch (error) {
        console.error("Error removing item:", error);
        // Re-add item if error occurs
        if (removedItem) {
          this.cartItems.splice(itemIndex, 0, removedItem);
        }
        this.error = "Failed to remove item";
      }
    },
    async checkout() {
      try {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          this.$router.push("/login");
          return;
        }

        // Prepare the order data in the required format
        const orderData = {
          user: {
            id: authStore.user.id,
          },
          total_amount: this.total,
          status: "pending",
          items: this.cartItems.map((item) => ({
            product: {
              id: item.product.id,
            },
            quantity: item.quantity,
          })),
        };

        // Send the request to create the order
        await axios.post(`/orders/create/${authStore.user.id}`, orderData);

        this.cartItems = [];
        this.$router.push("/cart");
      } catch (error) {
        console.error("Error during checkout:", error);
        this.error = "Checkout failed. Please try again.";
      }
    },
  },
  async mounted() {
    const authStore = useAuthStore();

    // Wait for auth to initialize
    if (!authStore.initialized) {
      await authStore.initializeAuth();
    }

    // Initial fetch
    if (authStore.isAuthenticated) {
      await this.fetchCart();
    }

    // Watch for auth changes
    watch(
      () => authStore.isAuthenticated,
      async (isAuthenticated) => {
        if (isAuthenticated) {
          await this.fetchCart();
        } else {
          this.cartItems = [];
        }
      }
    );
  },
};
</script>

<style scoped>
.h-custom {
  min-height: 65vh;
  height: calc(100% - 73px);
}

@media (max-width: 450px) {
  .h-custom {
    height: 100%;
  }
}

.card-registration-2 .bg-light {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

@media (max-width: 991px) {
  .card-registration-2 .bg-light {
    border-top-right-radius: 5px;
    border-bottom-left-radius: 0;
  }
}
</style>
