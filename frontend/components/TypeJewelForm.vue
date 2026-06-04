<template>
    <div class="min-h-screen bg-gray-900 p-8">
      <h1 class="text-2xl font-bold text-white mb-4">Add Jewel Type</h1>
      <form @submit.prevent="handleSubmit" class="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div class="flex flex-col mb-4">
          <label for="typeName" class="mb-2 text-gray-400">Type Name</label>
          <input
            type="text"
            id="typeName"
            v-model="typeName"
            placeholder="Enter jewel type name"
            required
            class="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-green-300"
          />
        </div>
  
        <div class="flex flex-col mb-4">
          <label for="description" class="mb-2 text-gray-400">Description</label>
          <textarea
            id="description"
            v-model="description"
            placeholder="Enter description"
            required
            class="p-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-green-300"
          ></textarea>
        </div>
  
        <button
          type="submit"
          class="w-full p-3 bg-green-400 text-black rounded-lg hover:bg-green-700"
        >
          Create Jewel Type
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
import { createJewelType } from '~/data/TypeJewelApi';
  
  const typeName = ref('');
  const description = ref('');
  
  const handleSubmit = async () => {
    try {
      await createJewelType({ name: typeName.value, description: description.value });
      alert('Jewel type created successfully!');
      typeName.value = '';
      description.value = '';
    } catch (error) {
      console.error('Error creating jewel type:', error);
      alert('Failed to create jewel type. Please try again.');
    }
  };
  </script>
  
  <style scoped>
  </style>