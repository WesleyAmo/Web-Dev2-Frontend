<template>
  <div class="container min-vh-60 d-flex flex-column">
    <!-- Success/Error Messages -->
    <div class="col-12 col-md-8 mt-3 mx-auto">
      <div v-if="successMessage" class="alert alert-success w-100">
        {{ successMessage }}
      </div>
      <div v-if="error" class="alert alert-danger w-100">
        {{ error }}
      </div>
    </div>

    <div class="row m-3 flex-grow-1">
      <div class="col-12 col-md-8 mx-auto">
        <div class="card mb-5">
          <div class="card-body">
            <h3 class="card-title mb-3 text-center">User Information</h3>
            <div class="table-responsive">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <div class="d-flex flex-column flex-sm-row">
                    <strong class="me-sm-2">ID:</strong>
                    <span>{{ user.id }}</span>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex flex-column flex-sm-row">
                    <strong class="me-sm-2">Username:</strong>
                    <span>{{ user.username }}</span>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex flex-column flex-sm-row">
                    <strong class="me-sm-2">Full Name:</strong>
                    <span>{{ user.fullName }}</span>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex flex-column flex-sm-row">
                    <strong class="me-sm-2">Email:</strong>
                    <span class="text-break">{{ user.email }}</span>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex flex-column flex-sm-row">
                    <strong class="me-sm-2">Phone:</strong>
                    <span>{{ user.phone }}</span>
                  </div>
                </li>
                <li class="list-group-item">
                  <div class="d-flex flex-column flex-sm-row">
                    <strong class="me-sm-2">Role:</strong>
                    <span>{{ user.role }}</span>
                  </div>
                </li>
              </ul>
              <div class="text-center mt-4">
                <button class="btn btn-outline-primary me-2" @click="showEditModal = true">
                  Edit Information
                </button>
                <button class="btn btn-primary" @click="showPasswordModal = true">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EditUserModal
      v-if="showEditModal"
      :user="user"
      :editForm="editForm"
      @close="closeEditModal"
      @update="updateUserInfo"
    />

    <ChangePasswordModal
      v-if="showPasswordModal"
      :user="user"
      @close="closePasswordModal"
      @change-password="changePassword"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "../../axios-auth";
import EditUserModal from "../../components/users/EditUserModal.vue";
import ChangePasswordModal from "../../components/users/ChangePasswordModal.vue";

const router = useRouter();
const route = useRoute();

const user = ref({
  id: "",
  username: "",
  fullName: "",
  email: "",
  phone: "",
  role: "",
});

const editForm = ref({
  username: "",
  fullName: "",
  email: "",
  phone: "",
});

const showEditModal = ref(false);
const showPasswordModal = ref(false);
const successMessage = ref("");
const error = ref("");

// Handle error event from child modal
const handleError = (errorMessage) => {
  // Set the error message
  error.value = errorMessage;
  // Close the modal
  showEditModal.value = false;
};

const fetchUserData = async () => {
  try {
    const response = await axios.get("/me");
    user.value = response.data;
    editForm.value = {
      username: user.value.username,
      fullName: user.value.fullName,
      email: user.value.email,
      phone: user.value.phone,
    };

    // Check for success message
    if (route.query.successMessage) {
      successMessage.value = route.query.successMessage;
      // Clear after 5 seconds
      setTimeout(() => (successMessage.value = ""), 5000);
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to fetch user data";
    setTimeout(() => (error.value = ""), 5000);
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const closePasswordModal = () => {
  showPasswordModal.value = false;
};

const updateUserInfo = async (payload, callback) => {
  try {
    const response = await axios.put(`/user/update/${user.value.id}`, payload);
    user.value = { ...user.value, ...payload };
    successMessage.value = "User information updated successfully";
    showEditModal.value = false;
    setTimeout(() => (successMessage.value = ""), 5000);
    callback(); // Success case
  } catch (err) {
    console.error("Update error:", err);
    callback(err); // Error case
  }
};

const changePassword = async (passwordData) => {
  try {
    const response = await axios.put(`/user/update-password/${user.value.id}`, passwordData);
    successMessage.value = "Password changed successfully";
    showPasswordModal.value = false;
    setTimeout(() => (successMessage.value = ""), 5000);
    return true;
  } catch (err) {
    // Error will be handled by the child component
    throw err;
  }
};

// Initialize component
onMounted(() => {
  fetchUserData();
});
</script>
