<template>
  <div class="container mt-5 mb-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <div class="card h-100">
          <div class="card-header bg text-white">
            <h4 class="text-center text-md-start">Order Management</h4>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="error" class="alert alert-danger">
              {{ error }}
            </div>
            <div v-else>
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col" class="d-none d-md-table-cell">#</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Total Price</th>
                      <th scope="col">Status</th>
                      <th scope="col" class="d-none d-md-table-cell">Order Date</th>
                      <th scope="col" class="d-none d-md-table-cell">Details</th>
                      <th scope="col">Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="orders.length === 0">
                      <td colspan="7" class="text-center">No orders found.</td>
                    </tr>
                    <tr v-for="order in orders" :key="order.id" :id="'order-row-' + order.id">
                      <th scope="row">{{ order.id }}</th>
                      <td class="d-none d-md-table-cell">
                        {{ order.user.fullName }}<br />
                        <small>{{ order.user.email }}</small>
                      </td>
                      <td>€{{ formatPrice(order.total_amount) }}</td>
                      <td :id="'status-' + order.id">
                        {{ capitalizeFirstLetter(order.status) }}
                      </td>
                      <td class="d-none d-md-table-cell">{{ formatDate(order.order_date) }}</td>
                      <td class="d-none d-md-table-cell">
                        <ul class="list-unstyled">
                          <li v-for="item in order.items" :key="item.id">
                            {{ item.quantity }}x {{ item.product.name }} @ €{{
                              formatPrice(item.product.price)
                            }}
                          </li>
                        </ul>
                      </td>
                      <td>
                        <select
                          name="status"
                          class="form-select form-select-sm w-100"
                          :value="order.status"
                          @change="updateOrderStatus(order.id, $event.target.value)"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processed</option>
                          <option value="shipped">Shipped</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../axios-auth";

export default {
  name: "OrderManagement",
  data() {
    return {
      orders: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get("/orders");
        this.orders = response.data;
      } catch (error) {
        this.error = this.getErrorMessage(error);
        console.error("Error fetching orders:", error);
      } finally {
        this.loading = false;
      }
    },

    async updateOrderStatus(orderId, newStatus) {
      try {
        const response = await axios.put("/orders/update", {
          order_id: orderId,
          status: newStatus.toLowerCase(),
        });

        if (response.data.success) {
          const orderIndex = this.orders.findIndex((o) => o.id === orderId);
          if (orderIndex !== -1) {
            this.orders[orderIndex].status = newStatus;
          }
        } else {
          throw new Error(response.data.message || "Update failed");
        }
      } catch (error) {
        alert("Error updating order status: " + this.getErrorMessage(error));
        console.error("Update error:", error);
        const selectElement = document.querySelector(`#order-row-${orderId} select`);
        const order = this.orders.find((o) => o.id === orderId);
        if (order && selectElement) {
          selectElement.value = order.status;
        }
      }
    },

    formatPrice(price) {
      return parseFloat(price).toFixed(2);
    },

    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },

    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    getErrorMessage(error) {
      if (error.response) {
        // Server responded with a status code outside 2xx range
        return error.response.data.message || error.response.statusText;
      } else if (error.request) {
        // Request was made but no response received
        return "Network error - no response received";
      } else {
        // Something happened in setting up the request
        return error.message || "Unknown error occurred";
      }
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  font-weight: 600;
}

.table-responsive {
  overflow-x: auto;
}

.form-select-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

@media (max-width: 767.98px) {
  .d-none.d-md-table-cell {
    display: none;
  }
}
</style>
