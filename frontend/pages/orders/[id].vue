<template>
  <div class="h-[calc(100vh-70px)] p-2 relative">
    <BackButton />
    <div v-if="isTooltipVisible" class="absolute px-2 py-1 bg-gray-800 text-white rounded text-sm"
         :style="{ top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px`, transform: 'translate(-50%, -100%)' }">
      {{ copiedMessage }}
    </div>

    <div v-if="order && jewel && winner" class="grid grid-cols-2 h-full">
      <div class="flex flex-col items-center justify-center p-4">
        <JewelItem :jewel="jewel" :price="order.price" />
      </div>
      <div class="bg-neutral rounded-lg flex flex-col justify-center items-center gap-4">
        <label class="w-full max-w-xs">
          <span class="label">
            <span class="label-text">Winner's email</span>
          </span>
          <input type="text" :value="winner.email"
                 class="input input-bordered w-full max-w-xs cursor-pointer" readonly
                 @click="copyToClipboard($event, winner.email)"/>
        </label>

        <label class="form-control w-full max-w-xs">
          <span class="label">
            <span class="label-text">Winner's address</span>
          </span>
          <input type="text" :value="`${winner.street}, ${winner.postalCode} ${winner.city}, ${winner.country}`"
                 class="input input-bordered w-full max-w-xs cursor-pointer" readonly
                 @click="copyToClipboard($event, `${winner.street}, ${winner.postalCode} ${winner.city}, ${winner.country}`)"/>
        </label>

        <label class="form-control w-full max-w-xs">
          <span class="label">
            <span class="label-text">Winner's phone number</span>
          </span>
          <input type="text" :value="winner.phoneNumber"
                 class="input input-bordered w-full max-w-xs cursor-pointer" readonly
                 @click="copyToClipboard($event, winner.phoneNumber)"/>
        </label>

        <label class="form-control w-full max-w-xs">
          <span class="label">
            <span class="label-text">Order Status</span>
          </span>
          <span class="flex items-center gap-4">
            <select v-model="currentStatus" class="select select-bordered w-full max-w-xs">
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </span>
        </label>

        <div class="flex gap-4 mt-4">
          <button class="btn btn-success" @click="saveStatus">Save</button>
          <button class="btn btn-error" @click="cancelAction">Cancel</button>
        </div>
      </div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import BackButton from "~/components/BackButton.vue";
import JewelItem from "~/components/JewelItem.vue";

import { fetchJewelById } from "~/data/JewelApi";
import { fetchUserById } from "~/data/ApiFetcher";
import { useRoute, useRouter } from "vue-router";
import { getOrders, saveOrder } from "~/data/OrderApi";

const router = useRouter();
const route = useRoute();
const orderId = parseInt(route.params.id as string);

const copiedMessage = ref("");
const isTooltipVisible = ref(false);
const tooltipPosition = reactive({ top: 0, left: 0 });

const order = ref<any>(null);
const jewel = ref<any>(null);
const winner = ref<any>(null);

// Use a simple ref for the select v-model so changes don't auto-save.
const currentStatus = ref('pending');

const statusOptions = ["completed", "pending", "waiting"];

onMounted(async () => {
  try {
    const orders = await getOrders();
    order.value = orders.find((o: any) => o.orderId === orderId);

    if (!order.value) {
      throw new Error("Order not found");
    }

    jewel.value = await fetchJewelById(order.value.jewelId);
    winner.value = await fetchUserById(order.value.userId);
    // initialize select with the order status (normalize to lowercase)
    currentStatus.value = order.value.status ? order.value.status.toLowerCase() : 'pending';
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const copyToClipboard = (event: MouseEvent, value: string) => {
  navigator.clipboard.writeText(value).then(() => {
    copiedMessage.value = "Copied!";
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    tooltipPosition.top = rect.top - 10 + window.scrollY;
    tooltipPosition.left = rect.left + rect.width / 2 + window.scrollX;

    isTooltipVisible.value = true;

    setTimeout(() => {
      isTooltipVisible.value = false;
    }, 2000);
  });
};

const saveStatus = async (newStatus?: string | Event) => {
  try {
    if (order.value) {
      const statusToSave = (typeof newStatus === 'string') ? newStatus : currentStatus.value;
      const updatedOrder = {
        ...order.value,
        status: statusToSave.toUpperCase()
      };

      await saveOrder(updatedOrder);
      console.log('Order status updated successfully:', updatedOrder);

      order.value = updatedOrder;

      router.back();
    } else {
      console.error('Order not found. Cannot update status.');
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

const cancelAction = () => {
  console.log("Cancelled");
};
</script>

<style scoped>
</style>