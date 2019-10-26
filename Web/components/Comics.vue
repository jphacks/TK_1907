<template>
  <section id="archives">
    <ul class="wrapper_contents_archives">
      <li
        class="each_book_archives"
        v-for="(comic, index) in comics"
        :key="index"
      >
        <article class="thumbnail_archives">
          <div @click="goDetail(comic.id)">
            <img :src="comic.thumbnail" />
          </div>
        </article>
      </li>
    </ul>
  </section>
</template>


<script>
export default {
  props: {
    comics: {
      type: Array,
      require: true
    }
  },
  methods: {
    goDetail(id) {
      this.$router.push("/comics/" + id);
    }
  }
};
</script>


<style scoped>
#archives {
  padding: 100px 0vw;
  width: 100vw;
  overflow-x: scroll;
}
#auchives .wrapper_contents_archives {
  width: 800px;
  padding: 0;
  margin: 0 auto;
}
#archives .each_book_archives {
  overflow: hidden;
  margin-bottom: 45px;
  margin-right: 5vw;
  border-radius: 4px;
  letter-spacing: normal;
  display: inline-block;
  vertical-align: top;
  margin-right: 5vw;
  width: 20vw;
  height: 28vw;
  box-shadow: 5px 5px 5px #f5f5f5;
}
#archives .thumbnail_archives {
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
  background-color: #f5f5f5;
}
#archives .thumbnail_archives > div > img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
