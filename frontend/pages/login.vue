<template>
  <Header title="Log in" />

  <div class="login-page flex flex-col items-center">
    <section class="login-form-section w-full max-w-5xl py-8 lg:pl-40 flex flex-col items-center">
      <div v-if="error" class="w-full px-8 mb-4">
        <div class="bg-red-500 text-white p-3 rounded-md">
          {{ error }}
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="w-full space-y-6">
        <div class="form-group space-y-2 px-8">
          <label for="email" class="text-white">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            required
            class="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-green-300"
          />
        </div>

        <div class="form-group space-y-2 px-8">
          <label for="password" class="text-white">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
            class="w-full p-2 bg-gray-800 text-white rounded-md border border-gray-500 placeholder-gray-400 focus:outline-none focus:border-green-300"
          />
        </div>

        <div class="form-group px-8">
          <NuxtLink 
            to="/SendMailToResetPass" 
            class="forgot-password text-green-400 hover:text-green-300"
          >
            Did you forget your password?
          </NuxtLink>
        </div>

        <div class="px-8">
          <NuxtLink 
            to="/signup" 
            class="create-account-button w-full block p-3 text-center border-2 border-green-400 text-green-400 rounded-md hover:bg-green-400/10 transition-colors duration-200"
          >
            Create Account
          </NuxtLink>
        </div>

        <button 
          type="submit" 
          class="login-button w-full p-3 bg-green-400 text-black rounded-md hover:bg-green-700 disabled:opacity-50"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Logging in...' : 'Log in' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '~/data/AuthenticationApi';
import { getCurrentLoggedInUser } from '~/data/ApiFetcher';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const checkAuth = async () => {
  try {
    const user = await getCurrentLoggedInUser();
    if (user) {
      await router.push('/');
    }
  } catch (err) {
    console.error('Auth check failed:', err);
  }
};

const handleLogin = async () => {
  error.value = '';
  isLoading.value = true;
  
  try {
    await login(email.value, password.value);
    await router.push('/');
  } catch (err) {
    console.error('Login failed:', err);
    error.value = err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
  } finally {
    isLoading.value = false;
  }
};

checkAuth();
</script>

<style scoped>
</style>