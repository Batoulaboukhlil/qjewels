<template>
  <BackButton />
  <div class="min-h-screen p-8 flex justify-center items-center bg-gray-900">
    <div class="bg-neutral h-auto w-full max-w-lg rounded-lg p-8">
      <form @submit.prevent="submitForm">
        <input
            type="text"
            placeholder="Name"
            v-model="name"
            class="input input-bordered w-full mb-4 px-4"
        />
        <input
            type="text"
            placeholder="Description"
            v-model="description"
            class="input input-bordered w-full mb-4 px-4"
        />
        <input
            type="text"
            placeholder="Short description"
            v-model="shortDescription"
            class="input input-bordered w-full mb-4 px-4"
        />

        <div class="flex flex-col mb-4">
          <select
              id="type"
              v-model="selectedType"
              class="p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-green-300"
          >
            <option disabled value="">Select a type</option>
            <option v-for="type in auctionTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <div class="flex flex-col mb-4">
          <label for="imageFile" class="mb-2 text-gray-400">Upload Image</label>
          <input
              type="file"
              id="imageFile"
              @change="handleFileChange"
              accept="image/*"
              class="p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-green-300"
          />
        </div>

        <div class="flex flex-col mb-4">
          <label for="startDate" class="mb-2 text-gray-400">Start Date</label>
          <input
              type="datetime-local"
              id="startDate"
              v-model="startDate"
              required
              class="p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-green-300"
          />
        </div>

        <div class="flex flex-col mb-4">
          <label for="endDate" class="mb-2 text-gray-400">End Date</label>
          <input
              type="datetime-local"
              id="endDate"
              v-model="endDate"
              required
              class="p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-green-300"
          />
        </div>

        <div class="form-control mb-6">
          <label class="label cursor-pointer">
            <span class="label-text">Published</span>
            <input
                type="checkbox"
                class="toggle toggle-primary ml-2"
                v-model="published"
            />
          </label>
        </div>

        <div class="flex justify-between items-center">
          <a
              href="/admin"
              class="text-blue-400 hover:text-blue-500 underline"
          >
            Cancel
          </a>
          <button type="submit" class="btn btn-primary px-6">Create Auction</button>
        </div>
      </form>
    </div>
  </div>
</template>




<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { getAuctionTypes, saveAuction } from '~/data/AuctionApi';
import BackButton from "~/components/BackButton.vue";
import { navigateTo } from '#app';
import { getUserRole } from "~/utils/auth-utils.js";

const auctionTypes = ref([]);
const selectedType = ref("");
const name = ref('');
const description = ref('');
const shortDescription = ref('');
const startDate = ref('');
const endDate = ref('');
const published = ref(false);
const selectedFile = ref(null);

onMounted(async () => {
  try {
    const role = await getUserRole();
    if (role !== 'ADMIN') {
      redirectToLogin();
    } else {
      auctionTypes.value = await getAuctionTypes();
    }
  } catch (error) {
    console.error('Error fetching auction types:', error);
    redirectToLogin();
  }
});
onBeforeMount(async () => {
  try {
    const role = await getUserRole();
    if (role !== 'ADMIN') {
      redirectToLogin();
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    redirectToLogin();
  }
});

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const submitForm = async () => {
  try {
    if (!selectedFile.value) {
      alert('Please select an image');
      return;
    }

    const auctionData = {
      naam: name.value,
      type: selectedType.value,
      startDate: startDate.value,
      endDate: endDate.value,
      published: published.value,
      description: description.value,
      shortDescription: shortDescription.value
    };

    await saveAuction(auctionData, selectedFile.value);
    alert('Auction created successfully!');

    name.value = '';
    description.value = '';
    shortDescription.value = '';
    selectedType.value = '';
    startDate.value = '';
    endDate.value = '';
    published.value = false;
    selectedFile.value = null;

    navigateTo('/admin');
  } catch (error) {
    console.error('Error creating auction:', error);
    alert('Error creating auction. Please try again.');
  }
};

const redirectToLogin = () => {
  navigateTo('/login');
};
</script>