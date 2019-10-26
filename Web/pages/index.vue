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
  </div>
</header>

<!-- top -->
<section id="top">
  <div class="wrapper_contents_top">
    <h2 class="catch_top">
      <img src="~/assets/catch_top.png" title="SANCHO" alt="SANCHO - 読みたい漫画がここにある">
    </h2>
    <p class="description_top">Next Gen Completely Transparent & Fair Comic Platform</p>
    <login/>
  </div>
</section>

<!-- introduction -->
<section id="introduction">
  <h2 class="title_introduction">
    <img src="~/assets/title_introduction.png" title="What is SANCHO" alt="テキスト画像" />
  </h2>
  <ul class="wrapper_contents_introduction">
    <li class="each_ex_introduction">
      <article>
        <div class="icon_introduction"><img src="~/assets/no_money.png" title="for free" alt="テキスト画像" /></div>
        <h3 class="each_title_introduction">Enjoy your favorite <br />comic for free!</h3>
        <p class="description_introduction">We can see out favorite manga anytime, anywhere, for free</p>
      </article>
    </li>
    <li class="each_ex_introduction">
      <article>
        <div class="icon_introduction"><img src="~/assets/author.png" title="author" alt="テキスト画像" /></div>
        <h3 class="each_title_introduction">Contribute, get money!</h3>
        <p class="description_introduction">
Gives the author the profit that it was originally unable to obtain due to the pirated illegal upload site</p>
      </article>
    </li>
    <li class="each_ex_introduction">
      <article>
        <div class="icon_introduction"><img src="~/assets/decentralization.png" title="decentralize" alt="テキスト画像" /></div>
        <h3 class="each_title_introduction">Transparent management!</h3>
        <p class="description_introduction">Completely non-centralized application that did not have a centrally managed server</p>
      </article>
    </li>
  </ul>
</section>

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
import Login from '~/components/Login.vue'

export default {
  components: {
    Login
  }
}
</script>

<style>
@charset "UTF-8";

/* header */
header {
  z-index: 9999;
  position: fixed;
  width: 100%;
  background: #000;
	box-shadow: 0px 5px 20px rgba(0, 0, 0, .3);
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
  padding: 11px 0;
}
header .rapper_form_header {
  display: -webkit-flex;
  -webkit-align-items: center;
  display: flex;
  align-items: center;
}
header .input_key_header {
  border: none;
  -webkit-appearance: none;
  border-radius: 4px;
  appearance: none;
  height: 41px;
  padding: 4px 10px;
  background: #fff;
  width: 500px;
}
header .button_go_header {
  background: #fff100;
  height: 40px;
  font-family: 'Oswald', sans-serif;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 20px;
  width: 110px;
  text-align: center;
  font-weight: bold;
  border: none;
  font-size: 14px;
  margin-left: 10px;
}
header .button_upload_header {
  background: #1e5ccc;
  height: 40px;
  font-family: 'Oswald', sans-serif;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  width: 110px;
  text-align: center;
  font-weight: bold;
  border: none;
  margin-left: 20px;
}

/* top */
#top {
  background-image: url('~/assets/background_top.jpg');
  width: 100%;
	background-attachment: fixed;
  position: relative;
  height: 100vh;
  display: -webkit-flex;
  -webkit-flex-direction: column;
  -webkit-justify-content: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
#top .wrapper_contents_top {
	margin-top: 65px;
}
#top .catch_top {
	width: 300px;
	margin: 0 auto;
}
#top .description_top {
  width: 500px;
  margin: 0 auto;
  font-size: 21px;
  margin-top: 30px;
  color: #fff;
  text-align: center;
  font-family: 'Oswald', sans-serif;
}

/* introduction */
#introduction {
  padding: 120px 0;
}
#introduction .title_introduction {
	width: 400px;
	margin: 0 auto;
}
#introduction .icon_introduction {
	width: 160px;
	height: 160px;
	margin: 0 auto;
	border-radius: 50%;
	background: #f6f6f6;
}
#introduction .each_title_introduction {
	text-align: center;
	font-weight: bold;
	font-size: 18px;
	margin-top: 20px;
}
#introduction .wrapper_contents_introduction {
	display: -webkit-flex;
	display: flex;
	width: 980px;
	margin: 60px auto 90px;
}
#introduction .each_ex_introduction {
	width: 290px;
	border-top: solid 1px #ddd;
	border-left: solid 1px #ddd;
	border-right: solid 1px #ddd;
  border-bottom: solid 6px #ddd;
  margin-right: auto;
  border-radius: 4px;
  padding: 20px;
}
#introduction .each_ex_introduction:last-child {
	margin-right: 0px;
}
#introduction .description_introduction {
  font-size: 13px;
  line-height: 20px;
  margin-top: 20px;
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
    color: #3B5998;
}
footer .fa-twitter {
    font-size: 21px;
    color: #ccc;
}
footer .fa-facebook-f {
    font-size: 19px;
    color: #ccc;
}

/*---------------------------------------------------------------*\
$1200px
\*---------------------------------------------------------------*/

@media screen and (max-width: 1200px) {
}

/*---------------------------------------------------------------*\
$1100px
\*---------------------------------------------------------------*/

@media screen and (max-width: 1100px) {
}

/*---------------------------------------------------------------*\
$1024px
\*---------------------------------------------------------------*/

@media screen and (max-width: 1024px) {
}

/*---------------------------------------------------------------*\
$980px
\*---------------------------------------------------------------*/

@media screen and (max-width: 980px) {
  /* body */
  body {
    min-width: 980px;
  }
}

</style>
