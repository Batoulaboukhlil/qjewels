<template>
  <div class="navbar bg-neutral">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden dropdown-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/profile">Profile</NuxtLink></li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl">GoldAuctions</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 flex gap-3">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/profile">Profile</NuxtLink></li>
        <li v-if="userRole === 'ADMIN'"><NuxtLink to="/admin">Admin</NuxtLink></li>
        <li v-if="userRole === 'ADMIN'"><NuxtLink to="/admin/additem">Add Jewel</NuxtLink></li>
        <li v-if="userRole === 'ADMIN'"><NuxtLink to="/admin/auctions">Add Auction</NuxtLink></li>
        <li v-if="userRole === 'ADMIN'"><NuxtLink to="/admin/addtype">Add Jewel Type</NuxtLink></li>
      </ul>
    </div>
    <div class="navbar-end flex gap-4">
      <button 
        class="btn" 
        v-if="userRole !== null"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { apiUrl } from '~/config/config';

const userRole = inject('userRole');
const updateUserRole = inject('updateUserRole');
const router = useRouter();

const handleLogout = async () => {
  try {
    await axios.post(`${apiUrl}/api/logout`, {}, { withCredentials: true });
    alert('Logged out successfully');
    router.push("/login");
  } catch (error) {
    console.error('Error logging out:', error);
    alert('Failed to log out. Please try again.');
  }
};
</script>

<style scoped>
</style>