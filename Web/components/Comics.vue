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
