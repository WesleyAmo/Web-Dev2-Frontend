<template>
  <div class="container mt-5 mb-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header bg text-white">
            <h4>Create New Product</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="name" class="form-label">Product Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="formData.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  class="form-control"
                  id="price"
                  v-model="formData.price"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  class="form-control"
                  id="description"
                  v-model="formData.description"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">Product Image</label>
                <input
                  type="file"
                  class="form-control"
                  id="image"
                  accept=".png,.jpeg,.jpg"
                  @change="handleFileSelect"
                  required
                />
                <div v-if="imagePreview" class="mt-2">
                  <img
                    :src="imagePreview"
                    :alt="formData.name || 'Product preview'"
                    class="img-thumbnail"
                    style="max-height: 150px"
                  />
                </div>
                <small class="text-muted">Only .png and .jpeg files allowed</small>
              </div>
              <div class="mb-3">
                <label for="category" class="form-label">Category</label>
                <select class="form-select" id="category" v-model="formData.category_id" required>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <button type="submit" class="btn btn-success">Create Product</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "../axios-auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const formData = ref({
      name: "",
      price: 0,
      description: "",
      image: "",
      category_id: null,
    });

    const imagePreview = ref(null);
    const categories = ref([]);

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        alert("Please select a .png or .jpeg file");
        event.target.value = "";
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.value = e.target.result;
      };
      reader.readAsDataURL(file);

      // Store the file path (relative to public folder)
      formData.value.image = `${file.name}`;
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        categories.value = response.data;
        if (categories.value.length > 0) {
          formData.value.category_id = categories.value[0].id;
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const submitForm = async () => {
      try {
        // The backend will receive the image path like "/images/filename.jpg"
        await axios.post("/products/insert", formData.value);
        router.push("/productmanagement");
      } catch (error) {
        console.error("Error creating product:", error);
      }
    };

    onMounted(() => {
      fetchCategories();
    });

    return {
      formData,
      categories,
      imagePreview,
      handleFileSelect,
      submitForm,
    };
  },
};
</script>

<style scoped></style>
