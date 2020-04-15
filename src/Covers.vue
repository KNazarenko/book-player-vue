<template>
  <fragment>
    <div class="col-6 col-md-3">
      <img
        @click="changeBook('London')"
        class="image"
        title="London"
        src="./assets/images/preview_100_sm.png"
        alt="Album photo London"
      />
    </div>

    <div class="col-6 col-md-3">
      <img
        @click="changeBook('NewYork')"
        class="image"
        title="New York"
        src="./assets/images/preview_105_sm.png"
        alt="Album photo New York"
      />
    </div>
    <div class="col-6 col-md-3">
      <img
        @click="changeBook('Paris')"
        class="image"
        title="Paris"
        src="./assets/images/preview_158_sm.png"
        alt="Album photo Paris"
      />
    </div>

    <div class="col-6 col-md-3">
      <img
        @click="changeBook('Rome')"
        class="image"
        title="Rome"
        src="./assets/images/preview_178_sm.png"
        alt="Album photo Rome"
      />
    </div>
  </fragment>
</template>

<script>
import { Fragment } from "vue-fragment";
export default {
  components: { Fragment },

  methods: {
    changeBook(city) {
      this.$root.$emit("change-book", city);
    },
  },
};
</script>

<style scoped>
.image {
  max-width: 100%;
  height: auto;
  cursor: pointer;
  transition: all 0.25s;
  transform: scale(0.9);
}

.image:hover {
  transform: scale(1);
}
</style>
