import Vue from "vue";
import App from "./App.vue";
import * as data from "./data.json";

/**
|--------------------------------------------------
| It works only with jquery @1.12.0 and turn.js 3rd release
| (turn.js-v1.0.5 npm i turn.js)
|--------------------------------------------------
*/

Vue.config.productionTip = false;

let allBooksData = data.default;

let bookPlayer;

if (allBooksData) {
  bookPlayer = new Vue({
    render: (h) => h(App),
  }).$mount(".bookContainer");

  // window.bookPlayer = bookPlayer;

  bookPlayer.$children[0].initApp(allBooksData, ".bookContainer");

  console.log(bookPlayer);
} else {
  console.log("There is no data");
}
