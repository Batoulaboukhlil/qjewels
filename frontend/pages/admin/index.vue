<template>
  <div class="grid grid-cols-2 h-[calc(100vh-70px)] p-4 gap-4">
    <!-- Search and Filter Section -->
    <div class="col-span-2 flex justify-between items-center">
      <div class="flex justify-between w-full items-center gap-4">
        <div class="flex justify-between w-1/2">
          <input
            type="text"
            class="input input-bordered w-1/3"
            placeholder="Search orders by name..."
            v-model="searchQuery"
          />
          <div class="col-span-2 flex items-center">
            <input type="checkbox" class="toggle toggle-primary" v-model="hideCompleted" />
            <span class="ml-2">Hide completed orders</span>
          </div>
          <div class="relative">
            <select v-model="selectedStatus" class="select select-bordered w-48">
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="waiting">Waiting</option>
            </select>
          </div>
        </div>
        <input
          type="text"
          class="input input-bordered w-1/3"
          placeholder="Search auctions by name..."
          v-model="auctionSearchQuery"
        />
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="col-span-2 grid grid-cols-2 gap-4" style="height: calc(100vh - 180px);">
      <!-- Left side: Orders -->
      <div class="h-[300px] bg-neutral rounded-lg overflow-y-auto">
        <AdminDashLists
          title="Active orders"
          :items="filteredOrders"
          buttonText="View order"
        >
          <template #item="{ item, buttonText }">
            <div class="flex items-center justify-between w-full">
              <p class="text-2xl font-bold">{{ item.jewelName }}</p>
              <div class="flex gap-6 items-center">
                <div class="badge badge-secondary">{{ item.status }}</div>
                <NuxtLink :to="`/orders/${item.orderId}`" class="btn btn-primary">
                  {{ buttonText }}
                </NuxtLink>
              </div>
            </div>
          </template>
        </AdminDashLists>
      </div>

      <!-- Right side: Auctions -->
      <div class="h-[300px] bg-neutral rounded-lg overflow-y-auto">
        <AdminDashLists
          title="Auctions"
          :items="filteredAuctions"
          buttonText="View auction"
        >
          <template #item="{ item, buttonText }">
            <div class="flex items-center justify-between w-full">
              <p class="text-2xl font-bold">{{ item.name }}</p>
              <NuxtLink :to="`/auctions/${item.auctionId}/items`" class="btn btn-primary">
                {{ buttonText }}
              </NuxtLink>
            </div>
          </template>
        </AdminDashLists>
      </div>

      <!-- Bottom: Jewels Table -->
      <div class="col-span-2 bg-neutral rounded-lg overflow-hidden">
        <div class="overflow-y-auto" style="height: calc(100vh - 500px);">
          <table class="table">
            <thead class="sticky top-0 bg-neutral">
              <tr>
                <th>Name</th>
                <th>Karaat</th>
                <th>Color</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <AdminDashTableItem
                v-for="jewel in unpublishedJewels"
                :key="jewel.jewelId"
                :itemId="jewel.jewelId"
                :name="jewel.name"
                :karaat="jewel.karat"
                :color="jewel.colorName"
                :type="jewel.typeName"
                :imageSrc="jewel.imageUrl"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { getAllAuctions } from '../../data/AuctionApi';
import { fetchJewelById, getAllJewels } from '../../data/JewelApi';
import { fetchJewelImage } from "~/data/JewelDataApiFetcher";
import { getOrders } from "../../data/OrderApi";
import { getUserRole } from "~/utils/auth-utils";

const activeOrders = ref([]);
const auctions = ref([]);
const unpublishedJewels = ref([]);

const hideCompleted = ref(false);
const searchQuery = ref("");
const selectedStatus = ref("");
const auctionSearchQuery = ref("");

// Filter orders
const filteredOrders = computed(() => {
  return activeOrders.value.filter((order) => {
    const matchesName = order.jewelName.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = selectedStatus.value === "" || order.status.toLowerCase() === selectedStatus.value.toLowerCase();
    const isNotCompleted = !hideCompleted.value || order.status.toLowerCase() !== 'completed';
    return matchesName && matchesStatus && isNotCompleted;
  });
});

// Filter auctions
const filteredAuctions = computed(() => {
  if (!auctionSearchQuery.value) return auctions.value;
  return auctions.value.filter(auction => 
    auction.name.toLowerCase().includes(auctionSearchQuery.value.toLowerCase())
  );
});

onMounted(async () => {
  try {
    const role = await getUserRole();
    if (role !== 'ADMIN') {
      return redirectToLogin();
    }

    auctions.value = await getAllAuctions();
    const ordersData = await getOrders();
    const jewels = await getAllJewels();
    
    unpublishedJewels.value = await Promise.all(jewels.map(async (jewel) => {
      try {
        const imageUrl = await fetchJewelImage(jewel.jewelId);
        return { ...jewel, imageUrl };
      } catch (error) {
        console.error(`Error fetching image for jewel ${jewel.jewelId}:`, error);
        return { ...jewel, imageUrl: '/path/to/default/image.jpg' };
      }
    }));

    activeOrders.value = await Promise.all(ordersData.map(async (order) => {
      const jewel = await fetchJewelById(order.jewelId);
      return {
        orderId: order.orderId,
        jewelName: jewel.name,
        status: order.status
      };
    }));

  } catch (error) {
    console.error('Error fetching data:', error);
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

const redirectToLogin = () => {
  navigateTo('/login');
};
</script>