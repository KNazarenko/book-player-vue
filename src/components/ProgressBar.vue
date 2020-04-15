<template>
  <div class="progress-bar">
    <div class="loading-bar">
      <div class="percentage" :style="{ width: percentage + '%' }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: ["percentage"]
};
</script>

<style lang="scss" scoped>
.bookContainer {
  .progress-bar {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
  }

  .loading-bar {
    position: absolute;
    width: 80%;
    height: 4%;
    border-radius: 3% / 50%;
    overflow: hidden;
    background-color: #f5f5f5;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);

    .percentage {
      position: absolute;
      height: 100%;
      background-color: #d94f70;
      border-radius: 3% / 50%;
    }
  }
}
</style>
