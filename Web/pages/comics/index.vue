<template>
<div>

<!-- header -->
<header>
  <div class="wrapper_contents_header">
    <h1 class="logo_header">
      <a href="/">
        <img src="~/assets/logo_header.png" title="SANCHO" alt="SANCHOロゴ">
      </a>
    </h1>
    <address-upload/>
  </div>
</header>

<!-- top -->
<section id="top">
  <div class="wrapper_contents_top">
    <h2 class="title_top_archives">
      <img src="~/assets/title_top_archives.png" title="Comics" alt="テキスト画像">
    </h2>
  </div>
</section>

<!-- comics -->
<comics/>

<!-- footer -->
<footer>
  <div class="wrapper_contents_footer">
    <span class="copyright">©2018 SANCHO All Rights Reserved.</span>
    <h2 class="logo_footer">
      <a href="">
        <img src="~/assets/logo_header.png" title="SANCHO" alt="ロゴ画像">
      </a>
    </h2>
    <div class="wrapper_right_footer">
      <ul class="sns_footer">
        <li class="each_sns">
          <a href="">
            <i class="fab fa-twitter"></i>
          </a>
        </li>
        <li class="each_sns">
          <a href="">
            <i class="fab fa-facebook-f"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</footer>

</div>
</template>


<script>
import AddressUpload from "~/components/AddressUpload.vue";
import Comics from "~/components/Comics.vue";

export default {
  components: {
    AddressUpload,
    Comics
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


<style>
@charset "UTF-8";

/* header */
header {
  z-index: 9999;
  position: fixed;
  width: 100%;
  background: #000;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.3);
}
header .logo_header {
  width: 120px;
}
header .logo_header a {
  display: -webkit-flex;
  -webkit-flex-direction: column;
  -webkit-justify-content: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
header .logo_header img {
  width: 100%;
  height: auto;
}
header .wrapper_contents_header {
  width: 1300px;
  display: -webkit-flex;
  -webkit-align-items: center;
  -webkit-justify-content: space-between;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px auto;
  padding: 10px 0;
}
header .rapper_form_header {
  display: -webkit-flex;
  -webkit-align-items: center;
  display: flex;
  align-items: center;
}
header .button_go_header {
  background: #fff100;
  height: 40px;
  font-family: "Oswald", sans-serif;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 20px;
  width: 150px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  border: none;
  margin-left: 10px;
}
header .wrapper_balance_header {
  width: auto;
  border-bottom: solid 2px #fff;
  display: -webkit-flex;
  -webkti-align-items: center;
  display: flex;
  align-items: center;
  margin-right: 20px;
  padding-bottom: 2px;
  margin-left: auto;
}
header .wrapper_form_header {
  display: -webkit-flex;
  -webkit-align-items: center;
  display: flex;
  align-items: center;
  width: 600px;
  margin-left: auto;
}
header .subtitle_balance_header {
  color: #fff;
  font-size: 14px;
  margin-right: 10px;
}
header .balance_header {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}

/* top */
#top {
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: url("~/assets/background_top.jpg");
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

/* footer */
footer {
  background: #000;
  padding: 60px 0 60px;
}
footer .logo_footer {
  width: 85px;
}
footer .logo_footer a {
  display: block;
}
footer .logo_footer img {
  width: 100%;
  height: auto;
}
footer .wrapper_contents_footer {
  position: relative;
  width: 980px;
  margin: 0 auto;
  display: -webkit-flex;
  -webkit-align-items: center;
  -webkit-justify-content: space-between;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
footer .wrapper_right_footer {
  display: -webkit-flex;
  -webkit-align-items: center;
  display: flex;
  align-items: center;
}
footer .contact_footer {
  font-size: 12px;
  text-decoration: underline;
  margin-right: 30px;
  color: #ccc;
}
footer .copyright {
  font-size: 10px;
  position: absolute;
  width: 190px;
  right: 0;
  left: 0;
  margin: auto;
  text-align: center;
  color: #555;
}
footer .sns_footer {
  display: -webkit-flex;
  -webkit-align-items: center;
  display: flex;
  align-items: center;
}
footer .each_sns {
  margin-right: 30px;
}
footer .each_sns:last-child {
  margin-right: 0px;
}
footer .each_sns > a {
  display: block;
}
footer .each_sns > a:hover .fa-twitter {
  color: #55acee;
}
footer .each_sns > a:hover .fa-facebook-f {
  color: #3b5998;
}
footer .fa-twitter {
  font-size: 21px;
  color: #ccc;
}
footer .fa-facebook-f {
  font-size: 19px;
  color: #ccc;
}
</style>

