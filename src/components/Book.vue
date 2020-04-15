<template>
  <div class="book" @mouseover="onShow" @mouseout="onHide" v-show="pages">
    <Page class="hard" :ref="first" :page="first" />

    <div class="hard">
      <img src="../assets/images/left-empty.jpg" />
    </div>

    <Page v-for="(page, index) in pages" :key="index" :page="page" :index="index" :ref="page" />

    <div class="hard">
      <img src="../assets/images/right-empty.jpg" />
    </div>

    <Page class="hard" :ref="last" :page="last" />
  </div>
</template>

<script>
import Page from "./Page";

export default {
  name: "Book",
  components: { Page },
  props: ["pages", "first", "last", "onShow", "onHide"]
};
</script>

<style lang="scss" scoped>
.bookContainer {
  .book {
    display: none;
    margin: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.2s ease-in-out;
  }

  .hard {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
