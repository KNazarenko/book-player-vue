<template>
  <fragment>
    <div class="row mt-5">
      <div class="col-12 col-md-7">
        <BookPlayer
          :bookData="currentBook"
          :rootSelector="selector"
          :key="keyId"
        />
      </div>

      <div class="col-12 col-md-5 mt-3 mt-md-0">
        <div class="card-body">
          <h5 class="card-title cardTitle">Card title</h5>

          <p class="card-text cardText">
            Some quick example text.
          </p>
        </div>
      </div>
    </div>

    <div class="row mt-5">
      <Covers />
    </div>
  </fragment>
</template>

<script>
import { Fragment } from "vue-fragment";
import BookPlayer from "./BookPlayer";
import Covers from "./Covers";
export default {
  name: "App",

  components: { Fragment, BookPlayer, Covers },

  data() {
    return {
      allBooksData: [],
      selector: null,

      currentBook: null,
      keyId: null,
    };
  },

  computed: {},

  methods: {
    initApp(allBooksData, selector) {
      this.allBooksData = allBooksData;
      this.selector = selector;

      this.currentBook = allBooksData[0];
      this.keyId = allBooksData[0].id;

      this.setInfo();
    },

    changeBook(city) {
      let newCity = this.allBooksData.filter((book) => book.id === city)[0];

      this.currentBook = newCity;
      this.keyId = newCity.id;

      this.setInfo();
    },

    setInfo() {
      let title = document.querySelector(".cardTitle");
      title.innerHTML = this.currentBook.title;

      let text = document.querySelector(".cardText");
      text.innerHTML = this.currentBook.about;
    },
  },

  created: function() {
    this.$root.$on("change-book", (city) => {
      this.changeBook(city);
    });
  },

  mounted: function() {},
};
</script>

<style scoped></style>
