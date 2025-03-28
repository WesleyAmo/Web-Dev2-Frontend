<template>
  <div class="modal fade show" style="display: block; background-color: rgba(0, 0, 0, 0.5)">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Edit User Information</h1>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger w-100 mb-3">
            {{ error }}
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="localEditForm.username"
                required
                maxlength="30"
                minlength="3"
              />
            </div>
            <div class="mb-3">
              <label for="fullname" class="form-label">Full Name</label>
              <input
                type="text"
                class="form-control"
                id="fullname"
                v-model="localEditForm.fullName"
                required
                maxlength="50"
                minlength="3"
              />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="localEditForm.email"
                required
                maxlength="60"
              />
            </div>
            <div class="mb-3">
              <label for="phone" class="form-label">Phone</label>
              <input
                type="tel"
                class="form-control"
                id="phone"
                v-model="localEditForm.phone"
                required
                maxlength="10"
                pattern="\d{10}"
                title="Phone number must be 10 digits"
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
import { ref, watch } from "vue";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  editForm: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "update"]);

const localEditForm = ref({ ...props.editForm });
const error = ref("");

watch(
  () => props.editForm,
  (newVal) => {
    localEditForm.value = { ...newVal };
  },
  { deep: true }
);

const handleSubmit = async () => {
  error.value = "";

  // Create payload with only changed fields
  const payload = {};
  if (localEditForm.value.username !== props.user.username)
    payload.username = localEditForm.value.username;
  if (localEditForm.value.fullName !== props.user.fullName)
    payload.fullName = localEditForm.value.fullName;
  if (localEditForm.value.email !== props.user.email) payload.email = localEditForm.value.email;
  if (localEditForm.value.phone !== props.user.phone) payload.phone = localEditForm.value.phone;

  // Only send request if there are changes
  if (Object.keys(payload).length > 0) {
    try {
      await emit("update", payload);
    } catch (err) {
      error.value = err.response?.data?.errorMessage || "Failed to update user information";
    }
  } else {
    error.value = "No changes detected";
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
