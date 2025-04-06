<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="card mb-4 h-100">
          <div class="card-header bg text-white">
            <h4 class="text-center text-md-start">Product Management</h4>
          </div>
          <div class="card-body">
            <div class="mb-4 text-center text-md-start">
              <router-link to="/productmanagement/createproduct" class="btn btn-success">
                Create New Product
              </router-link>
            </div>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col" class="d-none d-sm-table-cell">#</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Price</th>
                    <th scope="col" class="d-none d-sm-table-cell">Category</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in allProducts" :key="product.id">
                    <th scope="row" class="d-none d-sm-table-cell">{{ product.id || "N/A" }}</th>
                    <td>{{ product.name || "Unknown" }}</td>
                    <td>{{ formatPrice(product.price) }}</td>
                    <td class="d-none d-sm-table-cell">
                      {{ product.category?.name || "Unknown" }}
                    </td>
                    <td>
                      <div class="d-flex flex-wrap gap-2">
                        <button
                          @click="deleteProduct(product.id)"
                          class="btn btn-sm btn-danger flex-grow-1 flex-sm-grow-0"
                        >
                          Delete
                        </button>
                        <button
                          v-if="!product.isFeatured"
                          @click="featureProduct(product.id)"
                          class="btn btn-sm btn-primary flex-grow-1 flex-sm-grow-0"
                        >
                          Feature
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-8 mt-5 mb-5">
        <div class="card mb-4 h-100">
          <div class="card-header bg text-white">
            <h4>Featured Products by Category</h4>
          </div>
          <div class="card-body d-flex flex-column">
            <div v-for="category in categoryStore.categories" :key="category.id">
              <h5>{{ category.name || "Unknown" }}</h5>
              <div class="row">
                <template v-if="getFeaturedProducts(category.name).length === 0">
                  <div class="col-12">
                    <p>No featured products in this category.</p>
                  </div>
                </template>
                <template v-else>
                  <div
                    v-for="product in getFeaturedProducts(category.name)"
                    :key="product.id"
                    class="col-md-4 mb-3"
                  >
                    <div class="card h-100 d-flex flex-column">
                      <div class="card-body d-flex flex-column">
                        <h5 class="card-title">{{ product.name }}</h5>
                        <p class="card-text">{{ formatPrice(product.price) }}</p>
                        <button
                          @click="unfeatureProduct(product.id)"
                          class="btn btn-sm btn-warning mt-auto"
                        >
                          Unfeature
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "../../axios-auth";
import { useCategoryStore } from "@/stores/categoryStore";

export default {
  setup() {
    const allProducts = ref([]);
    const categoryStore = useCategoryStore();
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");
        allProducts.value = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const formatPrice = (price) => {
      const priceNumber = typeof price === "string" ? parseFloat(price) : price;
      return "$" + (priceNumber ?? 0).toFixed(2);
    };

    const deleteProduct = async (productId) => {
      if (confirm("Are you sure you want to delete this product?")) {
        try {
          await axios.delete(`/products/${productId}`);
          await fetchProducts();
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      }
    };

    const featureProduct = async (productId) => {
      if (confirm("Are you sure you want to feature this product on the home page?")) {
        try {
          await axios.put(`/products/${productId}/featured`, {
            isFeatured: true,
          });
          await fetchProducts();
        } catch (error) {
          console.error("Error featuring product:", error);
        }
      }
    };

    const unfeatureProduct = async (productId) => {
      if (confirm("Are you sure you want to remove this product from being featured?")) {
        try {
          await axios.put(`/products/${productId}/featured`, {
            isFeatured: false,
          });
          await fetchProducts();
        } catch (error) {
          console.error("Error unfeaturing product:", error);
        }
      }
    };

    const getFeaturedProducts = (categoryName) => {
      return allProducts.value.filter((product) => {
        return product.category?.name === categoryName && product.isFeatured;
      });
    };

    onMounted(() => {
      fetchProducts();
    });

    return {
      allProducts,
      categoryStore,
      formatPrice,
      deleteProduct,
      featureProduct,
      unfeatureProduct,
      getFeaturedProducts,
    };
  },
};
</script>
