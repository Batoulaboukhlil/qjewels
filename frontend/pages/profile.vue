<template>
  <div class="bg-gray-900 text-white min-h-screen flex flex-col">
    <header class="bg-gray-800 shadow-xl w-full py-8">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-extrabold text-gray-100">
          Account Details
        </h1>
        <p class="text-gray-400 text-lg mt-2">Manage your personal information</p>
      </div>
    </header>

    <main class="container mx-auto py-12 px-4 flex flex-col items-center w-full max-w-2xl">
      <section class="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full space-y-6 border border-gray-700">
        <h2 class="text-2xl font-bold text-gray-100 border-b border-gray-700 pb-4">
          Personal Information
        </h2>

        <div class="space-y-5">
          <div
              class="flex items-center justify-between p-4 bg-gray-700 rounded-xl transition-all duration-300 hover:bg-gray-600"
          >
            <div class="flex items-center space-x-4 w-full">
              <div class="flex-grow">
                <p class="font-semibold text-gray-300">{{ labels.name }}</p>
                <template v-if="!editing.name">
                  <p class="text-lg">{{ user.name || 'N/A' }}</p>
                </template>
                <template v-else>
                  <input
                      v-model="user.name"
                      class="w-full p-2 mt-1 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </template>
              </div>
            </div>
            <button
                @click="toggleEdit('name')"
                class="ml-4 text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              <span class="text-sm font-semibold">{{ editing.name ? 'Save' : 'Edit' }}</span>
            </button>
          </div>

          <div
              class="flex items-center justify-between p-4 bg-gray-700 rounded-xl transition-all duration-300 hover:bg-gray-600"
          >
            <div class="flex items-center space-x-4 w-full">
              <div class="flex-grow">
                <p class="font-semibold text-gray-300">{{ labels.email }}</p>
                <template v-if="!editing.email">
                  <p class="text-lg">{{ user.email || 'N/A' }}</p>
                </template>
                <template v-else>
                  <input
                      v-model="user.email"
                      type="email"
                      class="w-full p-2 mt-1 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </template>
              </div>
            </div>
            <button
                @click="toggleEdit('email')"
                class="ml-4 text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              <span class="text-sm font-semibold">{{ editing.email ? 'Save' : 'Edit' }}</span>
            </button>
          </div>

          <div
              v-for="(value, key) in user"
              :key="key"
              v-show="labels[key] && key !== 'name' && key !== 'email'"
              class="flex items-center justify-between p-4 bg-gray-700 rounded-xl transition-all duration-300 hover:bg-gray-600"
          >
            <div class="flex items-center space-x-4 w-full">
              <div class="flex-grow">
                <p class="font-semibold text-gray-300">{{ labels[key] }}</p>
                <template v-if="!editing[key]">
                  <p class="text-lg">{{ value || 'N/A' }}</p>
                </template>
                <template v-else>
                  <input
                      v-model="user[key]"
                      class="w-full p-2 mt-1 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </template>
              </div>
            </div>
            <button
                @click="toggleEdit(key)"
                class="ml-4 text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              <span class="text-sm font-semibold">{{ editing[key] ? 'Save' : 'Edit' }}</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCurrentLoggedInUser, updateUser } from "../data/ApiFetcher";
import { useRouter } from 'vue-router';
import { getUserRole } from '~/utils/auth-utils.js';

const user = ref({});
const editing = ref({
  name: false,
  email: false,
  phoneNumber: false,
  street: false,
  city: false,
  country: false,
  postalCode: false,
});

const labels = {
  name: "Name",
  email: "Email",
  phoneNumber: "Phone Number",
  street: "Street + Number",
  city: "City",
  country: "Country",
  postalCode: "Postal Code",
};

const router = useRouter();

const fetchUserData = async () => {
  try {
    const role = await getUserRole();
    if (!role) {
      router.push('/login');
      return;
    }

    const userData = await getCurrentLoggedInUser();
    user.value = userData;
  } catch (error) {
    console.error("Failed to fetch user data:", error.message);
    router.push('/login');
  }
};

const toggleEdit = async (field) => {
  if (editing.value[field]) {
    await updateUserField(field);
  }
  editing.value[field] = !editing.value[field];
};

const updateUserField = async (field) => {
  try {
    const updatedUser = { ...user.value };
    await updateUser(updatedUser);
    console.log("User updated successfully");
  } catch (error) {
    console.error("Failed to update user:", error.message);
  }
};

onMounted(() => {
  fetchUserData();
});
</script>