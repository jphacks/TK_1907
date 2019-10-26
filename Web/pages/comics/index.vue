<template>
  <div>
    <!-- top -->
    <section id="top">
      <div class="wrapper_contents_top">
        <h2 class="title_top_archives">
          <img
            src="~/assets/title_top_archives.png"
            title="Comics"
            alt="テキスト画像"
          />
        </h2>
      </div>
    </section>

    <!-- comics -->
    <comics />
  </div>
</template>


<script>
export default {
  components: {
    Comics: () => import("~/components/Comics.vue")
  },
  // TODO: サーバと繋がったらコメント外す
  // beforeCreate() {
  //   if (!this.$store.state.isLogin) {
  //     this.$router.push("/");
  //   }
  // },
  methods: {
    goUpload() {
      this.$router.push("/upload");
    }
  }
};
</script>

<script>
export default {
  middleware: 'authenticated'
}
</script>

<style>
@charset "UTF-8";

/* top */
#top {
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: url("~assets/background_top.jpg");
  height: 340px;
  padding-top: 60px;
}
#top .wrapper_contents_top {
  width: 230px;
  margin: 0px auto;
}
#top .title_top_archives img {
  width: 100%;
  height: auto;
}

/* archives */
#archives {
  padding: 40px 0 160px;
}
#archives .wrapper_contents_archives {
  letter-spacing: -0.4em;
  width: 90%;
  margin: 0 auto;
}
#archives .each_book_archives {
  width: 17.6%;
  box-shadow: 0px 15px 40px rgba(0, 0, 0, 0.3);
  margin-right: 3%;
  border-radius: 4px;
  letter-spacing: normal;
  display: inline-block;
  vertical-align: top;
}
#archives .each_book_archives:nth-of-type(5n) {
  margin-right: 0%;
  margin-bottom: 4%;
}
.thumbnail_archives {
  overflow: hidden;
  border-radius: 4px;
  width: 100%;
  height: 320px;
}
.thumbnail_archives > a {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

