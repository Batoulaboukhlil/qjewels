<script setup lang="ts">
import {ref, onMounted, provide} from 'vue';
import {getUserRole} from '~/utils/auth-utils.js';

const userRole = ref(null);

onMounted(async () => {
  const role = await getUserRole();
  userRole.value = role
});

provide('userRole', userRole);
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<style scoped>

</style>