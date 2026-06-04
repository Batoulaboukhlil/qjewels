<script>
import SignUpItem from '../components/SignUpItem.vue';
import Header from '~/components/Header.vue'

export default {
  components: {
    Header,
    SignUpItem
  },
  data() {
    return {
      userInput: ''
    };
  }
}

</script>

<template>
  <div>
    <Header title="Sign up" />
      <div class="">
        <SignUpItem
        />
      </div>
  </div>
</template>
