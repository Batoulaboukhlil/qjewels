<template>
  <div class="card bg-neutral flex flex-col h-fit">
    <NuxtImg
      :src="imageUrl"
      alt="Jewel Image"
      class="w-full rounded-tr-xl rounded-tl-xl object-cover"
    />
    <div class="flex items-center justify-between gap-3 p-4">
      <h2 class="text-2xl">{{ jewel.name }}</h2>
      <div class="badge badge-success">{{ price }} €</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { apiUrl } from '~/config/config';

interface Jewel {
  name: string;
  title: string;
  imageNames: string[];
}

const props = defineProps<{
  jewel: Jewel;
  price: number;
}>();

const getImageUrl = (imageName: string) => {
  return `${apiUrl}/api/jewels/image/${encodeURIComponent(imageName)}`;
};

const imageUrl = computed(() => {
  return getImageUrl(props.jewel.imageNames[0]);
});
</script>