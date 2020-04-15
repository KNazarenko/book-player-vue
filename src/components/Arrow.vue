<template>
  <svg
    class="icon"
    :class="[direction =='right' ? 'rightArrow' : 'leftArrow']"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    viewBox="0 0 91.5 183"
    xml:space="preserve"
    v-on:click="click"
  >
    <path class="st0" d="M0,183c50.5,0,91.5-41,91.5-91.5S50.5,0,0,0" v-if="direction == 'right'" />

    <path
      class="st0"
      d="M91.5,183C41,183,0,142,0,91.5C0,41,41,0,91.5,0"
      v-if="direction == 'left'"
    />

    <path
      class="st1"
      d="M27.5,58l27.9,27.9c1.7,1.7,1.7,4.5,0,6.2L27.5,120"
      v-if="direction == 'right'"
    />
    <path
      class="st1"
      d="M64,58L36.1,85.9c-1.7,1.7-1.7,4.5,0,6.2L64,120"
      v-if="direction == 'left'"
    />
  </svg>
</template>

<script>
export default {
  name: "Arrow",
  props: ["click", "direction"]
};
</script>

<style  lang="scss" scoped>
.bookContainer {
  .icon {
    z-index: 9999;
    display: block;
    position: relative;
    opacity: 1;
    cursor: pointer;
    -webkit-transition: transform 0.2s ease-in-out;
    -moz-transition: transform 0.2s ease-in-out;
    -o-transition: transform 0.2s ease-in-out;
    -ms-transition: transform 0.2s ease-in-out;
    transition: transform 0.2s ease-in-out;

    .st0 {
      fill: #c1c1c1;
      transition: all 0.25s;
    }

    .st1 {
      fill: none;
      stroke: #fff;
      stroke-width: 5;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-miterlimit: 10;
    }

    &:hover {
      .st0 {
        fill: #575756;
      }
    }
  }

  &.fullscreen {
    .icon {
      .st0 {
        fill: #494949;
      }

      &:hover {
        .st0 {
          fill: #545454;
        }
      }
    }
  }
}
</style>
