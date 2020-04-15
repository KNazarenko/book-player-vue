<template>
  <div class="page" :data-src="page">
    <img class="image-container" />
    <img src="../assets/images/leftPage.png" v-if="index && index % 2" />

    <img src="../assets/images/rightPage.png" v-else-if="index" />

    <ProgressBar :percentage="percentage" v-show="!isLaoded" />
  </div>
</template>

<script>
import ProgressBar from "./ProgressBar";

export default {
  name: "Page",

  components: { ProgressBar },

  props: {
    page: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: false
    }
  },

  data() {
    return {
      percentage: 0,
      isLaoded: false,
      xhr: null
    };
  },

  methods: {
    onLoad() {
      let url = this.page;
      let imgContainer = document
        .querySelector(`[data-src="${this.page}"]`)
        .querySelector(".image-container");

      this.loadImage(url)
        .then(imgSrc => {
          imgContainer.src = imgSrc;
        })
        .catch(error => console.log(error));
    },

    loadImage(imageUrl) {
      return new Promise(resolve => {
        var xhr = new XMLHttpRequest();

        xhr.open("GET", imageUrl, true);

        xhr.responseType = "arraybuffer";

        xhr.send();

        this.xhr = xhr;

        xhr.onprogress = e => {
          this.percentage = parseInt((e.loaded / e.total) * 100);
        };

        xhr.onload = () => {
          this.percentage = 100;

          var blob = new Blob([xhr.response]);

          resolve(window.URL.createObjectURL(blob));

          // if (this.index || this.index == 0)
          //   console.log("Page ", this.index + 3, " is loaded!");
          // else console.log("Page first/last is loaded!");

          this.isLaoded = true;

          this.$root.$emit("page-loaded", this.page);
        };

        xhr.onerror = e => {
          console.log("Page ", this.page, " is faild!", e);
        };

        xhr.onabort = () => {
          if (this.index || this.index == 0) {
            // console.log("Page ", this.index + 3, " is aborted!", this.page);
          } else console.log("Page first/last is aborted!");

          this.$root.$emit("page-aborted", this.page);
        };
      });
    },

    onAbort() {
      this.xhr.abort();
    }
  }
};
</script>

<style lang="scss" scoped>
.bookContainer {
  .page {
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
