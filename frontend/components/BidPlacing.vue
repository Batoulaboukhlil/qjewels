<template>
  <div class="pl-2 pr-2 flex flex-col mb-10">
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <div class="flex justify-between mt-4">
      <input
          type="text"
          :placeholder="placeholder"
          class="input input-bordered w-1/2 max-w-xs"
          v-model="inputValue"
      />
      <button class="btn btn-primary" @click="handleClick">{{ buttonText }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Enter amount'
    },
    buttonText: {
      type: String,
      default: 'Place bid'
    }
  },
  data() {
    return {
      inputValue: ''
    };
  },
  methods: {
    handleClick() {
      this.$emit('bid', this.inputValue);
    }
  }
};
</script>


