<template>
  <div>
    <h1 class="text-3xl font-bold underline p-4 m-2 text-center">
      List of active auctions
    </h1>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>
    <div v-else-if="auctionData.length === 0" class="text-center">
      No auctions found
    </div>
    <div v-else class="w-screen flex flex-column items-center justify-center">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        <AuctionCard
            v-for="(data, index) in auctionData"
            :key="index"
            :auctionPiece="data"
        />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AuctionCard from '../components/AuctionCard.vue';
import { getAllAuctions } from '~/data/AuctionApi';
import { getUserRole } from '~/utils/auth-utils.js';
import { useRouter } from 'vue-router';
const auctionData = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();

onMounted(async () => {
  try {
    loading.value = true;
    const role = await getUserRole();
    if (!role) {
      router.push('/login');
      return;
    }
    auctionData.value = await getAllAuctions();
  } catch (err) {
    console.error('Error fetching auction data:', err);
  } finally {
    loading.value = false;
  }
});
</script>