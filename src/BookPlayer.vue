<template>
  <div class="bookContainer" :class="{ fullscreen: fullscreenMode }">
    <Arrow
      :direction="'left'"
      :click="onPrevious"
      :style="leftArrowStyles"
      v-show="this.data.pages"
    />

    <img
      class="bookBackground"
      src="./assets/images/background-shape.png"
      :width="coverWidth"
      :height="coverHeight"
      :style="coverStyles"
    />

    <div class="frontBackground" :style="frontbackgroundStyles"></div>

    <Book
      v-if="firstPage && lastPage"
      :first="firstPage"
      :last="lastPage"
      :pages="restPages"
      :onShow="onShowFullScreenBtn"
      :onHide="onHideFullScreenBtn"
      :style="bookStyles"
      ref="bookComponent"
    />

    <Arrow
      :direction="'right'"
      :click="onNext"
      :style="rightArrowStyles"
      v-show="this.data.pages"
    />

    <div
      class="fullScreenBtn"
      :class="{ visible: showFullscreenBtn }"
      :style="fullscreenBtnStyles"
      @click="toggleFullScreen"
    >
      Fullscreen
    </div>

    <div class="offFullscreenBtn" :style="offFullscreenBtnStyles">
      <div class="quitBtn" @click="toggleFullScreen">Exit</div>
    </div>
  </div>
</template>
`
<script>
import $ from "jquery";
// import "turn.js";
require("./lib/turn_v3_npm/index");
import Book from "./components/Book";
import Arrow from "./components/Arrow";

export default {
  name: "BookPlayer",

  components: { Book, Arrow },

  props: ["bookData", "rootSelector"],

  data() {
    return {
      selector: null,
      backgroundRatio: 1.044,
      percent: 0.95,

      data: {},
      queue: [],
      loading: null,
      loaded: [],

      showFullscreenBtn: false,

      isFirstPage: false,
      isLastPage: false,

      bookWidth: null,
      bookHeight: null,

      fullscreenMode: false,
      arrowOriginalWidth: 50,
      arrowWidth: 50,

      isMobileMode: false,
    };
  },

  computed: {
    bookOriginalWidth() {
      if (this.data.pages) return this.data.pageWidth * 2;
      else return null;
    },

    firstPage() {
      if (this.data.pages) return this.data.pages[0];
      else return null;
    },

    lastPage() {
      if (this.data.pages) return this.data.pages[this.data.pages.length - 1];
      else return null;
    },

    restPages() {
      if (this.data.pages) return this.data.pages.slice(1, -1);
      else return null;
    },

    coverWidth() {
      return this.bookWidth * this.backgroundRatio;
    },

    coverHeight() {
      return this.bookHeight * this.backgroundRatio;
    },

    arrowShift() {
      let shift = (this.coverWidth - this.bookWidth) / 2;
      return shift + "px";
    },

    frontbackgroundStyles() {
      let styles = {
        width: this.bookWidth / 2 + "px",
        height: this.bookHeight + "px",
        display: this.isFirstPage || this.isLastPage ? "block" : "none",
      };

      return styles;
    },

    leftArrowStyles() {
      let arrowWidth = this.arrowWidth + "px";

      let middlePagesStyles = {
        width: arrowWidth,
        right: this.arrowShift,
      };
      let coverPagesStyles = { width: arrowWidth };

      if (this.isLastPage) {
        coverPagesStyles = { ...coverPagesStyles, left: this.bookShift };
      } else {
        coverPagesStyles = { ...coverPagesStyles, display: "none" };
      }

      return this.isFirstPage || this.isLastPage
        ? coverPagesStyles
        : middlePagesStyles;
    },

    rightArrowStyles() {
      let arrowWidth = this.arrowWidth + "px";

      let middlePagesStyles = { width: arrowWidth, left: this.arrowShift };
      let coverPagesStyles = { width: arrowWidth };

      if (this.isFirstPage) {
        coverPagesStyles = { ...coverPagesStyles, right: this.bookShift };
      } else {
        coverPagesStyles = { ...coverPagesStyles, display: "none" };
      }

      return this.isFirstPage || this.isLastPage
        ? coverPagesStyles
        : middlePagesStyles;
    },

    bookShift() {
      let shift = this.bookWidth / 4 - this.arrowWidth / 2;

      return shift + "px";
    },

    bookStyles() {
      let middlePagesStyles = {
        border: "solid 1px rgba(0, 0, 0, 0.05)",
      };
      let coverPagesStyles = {};

      if (this.isFirstPage) {
        coverPagesStyles = { transform: `translate(-${this.bookShift})` };
      } else if (this.isLastPage) {
        coverPagesStyles = { transform: `translate(${this.bookShift})` };
      }

      if (!this.fullscreenMode) {
        middlePagesStyles = {
          ...middlePagesStyles,
          boxShadow: "rgb(179, 178, 178) 1px 4px 6px 0px",
        };
      }

      return this.isFirstPage || this.isLastPage
        ? coverPagesStyles
        : middlePagesStyles;
    },

    coverStyles() {
      let middlePagesStyles = { opacity: 1 };
      let coverPagesStyles = {};

      if (this.isFirstPage) {
        coverPagesStyles = {
          transform: `translate(-${this.bookShift})`,
          opacity: 0,
        };
      } else {
        coverPagesStyles = {
          transform: `translate(${this.bookShift})`,
          opacity: 0,
        };
      }

      return this.isFirstPage || this.isLastPage
        ? coverPagesStyles
        : middlePagesStyles;
    },

    fullscreenBtnStyles() {
      return this.isMobileMode
        ? { display: "none" }
        : { display: !this.fullscreenMode ? "block" : "none" };
    },

    offFullscreenBtnStyles() {
      return this.isMobileMode
        ? { display: "none" }
        : { display: this.fullscreenMode ? "block" : "none" };
    },

    container() {
      return $(`${this.selector}`);
    },

    book() {
      return $(".book");
    },

    arrow() {
      return $(".icon");
    },
  },

  methods: {
    initApp(data, selector, readyCallback) {
      this.selector = selector;

      this.data = data;

      this.bookWidth = data.pageWidth;
      this.bookHeight = data.pageHeight;

      this.queue = data.pages;

      this.$nextTick(() => {
        this.createDoubleBook();

        if (this.isMobile() || this.isTablet()) this.isMobileMode = true;

        this.onResizeBook();
      });

      if (readyCallback) readyCallback();
    },

    onPrevious() {
      this.book.turn("previous");
    },

    onNext() {
      this.book.turn("next");
    },

    onShowFullScreenBtn() {
      this.showFullscreenBtn = true;
    },

    onHideFullScreenBtn() {
      this.showFullscreenBtn = false;
    },

    // --------------------------- FULL SCREEN  --------------------------- //

    toggleFullScreen() {
      let fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;

      if (!fullscreenElement) this.enterFullScreen();
      else this.exitFullScreen();
    },

    enterFullScreen() {
      let element = this.container[0];

      if (element.requestFullscreen) {
        element.requestFullscreen();
        this.fullscreenMode = true;
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
        this.fullscreenMode = true;
      }
    },

    exitFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.fullscreenMode = false;
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
        this.fullscreenMode = false;
      }
    },

    // --------------------------- CREATE BOOK --------------------------- //

    createDoubleBook() {
      $(".book").turn({
        width: this.bookOriginalWidth,
        height: this.data.pageHeight,
        display: "double",
        when: {
          turning: this.turningEventListener.bind(this),
          turned: this.turnedEventListener.bind(this),
        },
      });
    },

    // --------------------------- RESIZE -------------------------------- //

    onResizeBook() {
      if (!this.container[0]) return;

      let ratio;

      let bookWidth = this.bookOriginalWidth;
      let bookHeight = this.data.pageHeight;
      let arrowWidth = this.arrowOriginalWidth;

      let containerWidth = this.container[0].clientWidth;

      let bookContainerWidth = bookWidth + arrowWidth * 2;

      ratio = (containerWidth * this.percent) / bookContainerWidth;

      this.book.turn("size", bookWidth * ratio, bookHeight * ratio);

      this.bookWidth = bookWidth * ratio;
      this.bookHeight = bookHeight * ratio;
      this.arrowWidth = arrowWidth * ratio;
    },

    // --------------------------- TURN EVENT --------------------------- //

    turningEventListener(event, page) {
      // To shift the book more smoothly
      if (page == 1) {
        this.isFirstPage = true;
      } else if (page == this.restPages.length + 4) {
        this.isLastPage = true;
      } else {
        this.isFirstPage = false;
        this.isLastPage = false;
      }
    },

    turnedEventListener(event, page) {
      // 0. Check or queue is not empty
      if (!this.queue.length) return;

      let currentPageUrls = [];

      let currentLeftPageUrl;
      let currentRightPageUrl;

      let pageOne;
      let pageTwo;

      // To move the book forward and backward
      if (page % 2 == 0) {
        pageOne = page;
        pageTwo = page + 1;
        // console.log(`Even Page ${pageOne}, ${pageTwo}`);
      } else {
        pageOne = page - 1;
        pageTwo = page;
        // console.log(`Odd Page: ${pageTwo}, ${pageOne}`);
      }

      let leftPage = event.target.querySelector(`[page="${pageOne}"]`);
      if (leftPage) {
        let leftPageImg = leftPage.querySelector(`[data-src]`);
        if (leftPageImg) currentLeftPageUrl = leftPageImg.dataset.src;
      }

      // 1. If this is not the second or penultimate page, and if this page is not loaded, then
      // 2. We stop the active download, if there is one,
      // 3. And add the page to the spread download array
      if (currentLeftPageUrl && !this.isLoaded(currentLeftPageUrl)) {
        if (this.loading) this.abortLoading();

        currentPageUrls.push(currentLeftPageUrl);
      }

      let rightPage = event.target.querySelector(`[page="${pageTwo}"]`);
      if (rightPage) {
        let rightPageImg = rightPage.querySelector(`[data-src]`);
        if (rightPageImg) currentRightPageUrl = rightPageImg.dataset.src;
      }

      if (currentRightPageUrl && !this.isLoaded(currentRightPageUrl)) {
        if (this.loading) this.abortLoading();

        currentPageUrls.push(currentRightPageUrl);
      }

      // 4. If there is something to download at the current spread, then at the beginning of the download queue we place the pages of the current spread.
      // 5. And call loading
      if (currentPageUrls.length) {
        this.onChangeQueue(currentPageUrls);

        this.downloadImage();
      } else {
        if (this.loading) this.abortLoading();

        this.downloadImage();
      }
    },

    isLoaded(url) {
      return this.loaded.find((item) => item == url);
    },

    abortLoading() {
      let currentLoading = this.loading;

      // References of all pages
      let allPagesRefs = this.$refs.bookComponent.$refs;
      // Reference of the next page in the download queue
      let nextDownloadPageRef;

      // Find the next page to download the picture
      for (let key in allPagesRefs) {
        // Because part of the refs are objects, and part are arrays
        if (allPagesRefs[key].length) {
          if (allPagesRefs[key][0].page == currentLoading) {
            nextDownloadPageRef = allPagesRefs[key];
            break;
          }
        } else {
          if (allPagesRefs[key].page == currentLoading) {
            nextDownloadPageRef = allPagesRefs[key];
            break;
          }
        }
      }

      // 4. Download the next image
      if (nextDownloadPageRef) {
        if (nextDownloadPageRef.length) {
          nextDownloadPageRef[0].onAbort();
        } else {
          nextDownloadPageRef.onAbort();
        }
      }
    },

    onChangeQueue(urls) {
      let newQueue = this.queue.filter(
        (item) => item != urls[0] && item != urls[1]
      );

      this.queue = urls.concat(newQueue);
    },

    downloadImage() {
      // 1. Take next url
      let nextImgUrl = this.queue[0];

      // 2. Check or next page for download is available
      let nextDownloadPage = this.book[0].querySelector(
        `[data-src="${nextImgUrl}"]`
      );
      if (!nextDownloadPage) return;

      // References of all pages
      let allPagesRefs = this.$refs.bookComponent.$refs;
      // Reference of the next page in the download queue
      let nextDownloadPageRef;

      // 3. Find the next page to download the picture
      for (let key in allPagesRefs) {
        // Because part of the refs are objects, and part are arrays
        if (allPagesRefs[key].length) {
          if (allPagesRefs[key][0].page == nextImgUrl) {
            nextDownloadPageRef = allPagesRefs[key];
            break;
          }
        } else {
          if (allPagesRefs[key].page == nextImgUrl) {
            nextDownloadPageRef = allPagesRefs[key];
            break;
          }
        }
      }

      // 4. Download the next image
      if (nextDownloadPageRef) {
        if (nextDownloadPageRef.length) {
          this.loading = nextImgUrl;

          nextDownloadPageRef[0].onLoad();
        } else {
          this.loading = nextImgUrl;

          nextDownloadPageRef.onLoad();
        }
      }
    },

    onDelete(url) {
      // Remove from download queue
      let newQueue = this.queue.filter((item) => item != url);
      this.queue = newQueue;

      // Remove from current downloads list
      this.loading = null;
    },

    // --------------------------- IS MOBILE -------------------------------- //

    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },

    isTablet() {
      return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
        navigator.userAgent.toLowerCase()
      );
    },
  },

  created: function() {
    this.$root.$on("page-loaded", (url) => {
      // 0. Add downloaded img to loaded list
      this.loaded.push(url);
      // 1. Delete downloaded img from the queue and from the current loading
      this.onDelete(url);
      // 2. Check or queue is not empty
      if (!this.queue.length) return;
      // 3. Download next image
      this.downloadImage();
    });

    this.$root.$on("page-aborted", () => {
      this.loading = null;
    });
  },

  mounted: function() {
    this.$nextTick(() => {
      if (this.bookData) this.initApp(this.bookData, this.rootSelector);
    });

    window.addEventListener("resize", () => {
      // console.log("resize");
      let fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;

      // For exit fullscreen mode with ESC button
      if (!fullscreenElement) this.fullscreenMode = false;

      this.onResizeBook();
    });

    // For mobile fullscreen mode
    document.addEventListener("fullscreenchange", () => {
      if (this.isMobile() || this.isTablet()) {
        console.log("onfullscreenchange");
        this.onResizeBook();
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.bookContainer {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  &:-webkit-full-screen {
    background-color: #000;
  }

  .bookBackground {
    position: absolute;
    opacity: 0;
    transition: all 0.2s ease-in-out;
  }

  .slice {
    position: absolute;
    opacity: 0;
    transition: all 0.2s ease-in-out;
  }

  .frontBackground {
    position: absolute;
    box-shadow: 2px 2px 5px 0 #656565;
  }

  .fullScreenBtn {
    min-width: 150px;
    font-size: 16px;
    border: solid 0px;
    background-color: rgba(18, 18, 18, 0.3);
    border-radius: 20px;
    color: #fefefe;
    cursor: pointer;
    padding: 10px;
    text-align: center;
    position: absolute;
    opacity: 0;
    transition: all 0.25s;
    transform: scale(0.9);

    &.visible {
      opacity: 1;
    }

    &:hover {
      background-color: rgba(18, 18, 18, 0.8);
      transform: scale(1);
      opacity: 1;
    }
  }

  .offFullscreenBtn {
    width: 100%;
    position: absolute;
    bottom: 20px;
    text-align: center;
  }

  .quitBtn {
    padding: 10px 20px;
    background-color: #494949;
    display: inline-block;
    border-radius: 20px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: background-color 0.25s;

    &:hover {
      background-color: #545454;
    }
  }
}
</style>
