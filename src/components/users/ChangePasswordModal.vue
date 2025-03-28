<template>
  <div class="modal fade show" style="display: block; background-color: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Change Password</h1>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger w-100 mb-3">
            {{ error }}
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="oldPassword" class="form-label">Current Password</label>
              <input
                type="password"
                class="form-control"
                id="oldPassword"
                v-model="passwordForm.oldPassword"
                required
              />
            </div>
            <div class="mb-3">
              <label for="newPassword" class="form-label">New Password</label>
              <input
                type="password"
                class="form-control"
                id="newPassword"
                v-model="passwordForm.newPassword"
                required
              />
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm New Password</label>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary">Save changes</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "change-password"]);

const passwordForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const error = ref("");

const handleSubmit = async () => {
  error.value = "";

  // Validate password match
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    error.value = "New passwords do not match";
    return;
  }

  // Validate password length
  if (passwordForm.value.newPassword.length < 8) {
    error.value = "Password must be at least 8 characters";
    return;
  }

  try {
    await emit("change-password", {
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword,
    });

    // Reset form on success
    passwordForm.value = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  } catch (err) {
    console.error("Password change error:", err.response);
    if (err.response?.status === 401) {
      error.value = err.response.data?.errorMessage || "Current password is incorrect";
    } else if (err.response?.status === 400) {
      error.value = err.response.data?.errorMessage || "Invalid request format";
    } else {
      error.value = "Failed to change password. Please try again.";
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  overflow-y: auto;
}

.modal-dialog {
  margin: 1.75rem auto;
}
</style>
