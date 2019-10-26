<template>
  <div>
    <file-upload />
  </div>
</template>


<script>
export default {
  components: {
    FileUpload: () => import("~/components/FileUpload.vue")
  }
  // TODO: サーバと繋がったらコメント外す
  // beforeCreate() {
  //   if (!this.$store.state.isLogin) {
  //     this.$router.push("/");
  //   }
  // },
};
</script>

<style>
@charset "UTF-8";

/* detail */
#detail {
  width: 100%;
  height: 100vh;
  padding-top: 60px;
  flex-direction: column;
  display: flex;
  justify-content: center;
}
#detail .wrapper_contents_detail {
  display: flex;
  margin: 0 auto;
  width: 800px;
}
#detail .info_detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#detail .title_book_detail {
  font-size: 40px;
  text-align: center;
}
#detail .description_book_detail {
  font-size: 16px;
  color: #888;
  text-align: center;
  margin-top: 10px;
}
#detail .button_upload_header {
  display: flex;
  justify-content: center;
  background: #1e5ccc;
  display: block;
  padding: 32px 0 32px 126px;
  appearance: none;
  border-radius: 100px;
  color: #fff;
  font-size: 14px;
  width: 60%;
  margin: 0 auto;
  text-align: center;
  font-weight: bold;
  border: none;
  box-shadow: 0px 15px 40px rgba(0, 0, 0, 0.2);
}
#detail .wrapper_form_header {
  margin-top: 40px;
}

/* archives */
#archives {
  padding: 0px 0 80px;
}
#archives .wrapper_contents_archives {
  letter-spacing: -0.4em;
  width: 1000px;
  margin: 0 auto;
}
#archives .each_book_archives {
  width: 16.8%;
  margin-right: 4%;
  overflow: hidden;
  margin-bottom: 40px;
  border-radius: 4px;
  letter-spacing: normal;
  display: inline-block;
  vertical-align: top;
}
#archives .each_book_archives:nth-of-type(5n) {
  margin-right: 0%;
}
#archives .thumbnail_archives {
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 180px;
  background-color: #f5f5f5;
}
#archives .thumbnail_archives > a {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

