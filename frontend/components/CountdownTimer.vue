<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps<{
  endDate: string;
}>();

const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
});

const isExpired = ref(false);
let timer: NodeJS.Timer;

const timerColor = computed(() => {
  if (timeLeft.value.days === 0) {
    if (timeLeft.value.hours < 1) {
      return 'text-error';
    }
    return 'text-warning';
  }
  return 'text-primary';
});

const calculateTimeLeft = () => {
  const now = new Date().getTime();
  const endTime = new Date(props.endDate).getTime();
  const difference = endTime - now;

  if (difference <= 0) {
    isExpired.value = true;
    clearInterval(timer);
    return;
  }

  timeLeft.value = {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000)
  };
};

onMounted(() => {
  calculateTimeLeft();
  timer = setInterval(calculateTimeLeft, 1000);
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <div class="bg-neutral rounded-xl p-4">
    <h2 class="text-xl font-bold mb-4 text-center">Time Left</h2>
    <div v-if="!isExpired" class="grid grid-cols-4 gap-2">
      <div class="flex flex-col items-center p-2 rounded-lg bg-base-100">
        <span class="text-2xl font-bold" :class="timerColor">{{ timeLeft.days }}</span>
        <span class="text-sm opacity-80">Days</span>
      </div>
      <div class="flex flex-col items-center p-2 rounded-lg bg-base-100">
        <span class="text-2xl font-bold" :class="timerColor">{{ timeLeft.hours }}</span>
        <span class="text-sm opacity-80">Hours</span>
      </div>
      <div class="flex flex-col items-center p-2 rounded-lg bg-base-100">
        <span class="text-2xl font-bold" :class="timerColor">{{ timeLeft.minutes }}</span>
        <span class="text-sm opacity-80">Minutes</span>
      </div>
      <div class="flex flex-col items-center p-2 rounded-lg bg-base-100">
        <span class="text-2xl font-bold" :class="timerColor">{{ timeLeft.seconds }}</span>
        <span class="text-sm opacity-80">Seconds</span>
      </div>
    </div>
    <div v-else class="text-error font-bold text-xl text-center">
      Auction Ended
    </div>
  </div>
</template>