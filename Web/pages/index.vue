<template>
  <div>
    <!-- top -->
    <section id="top">
      <div class="wrapper_contents_top">
        <h2 class="catch_top">
          <img
            src="~/assets/catch_top.png"
            title="SANCHO"
            alt="SANCHO - 読みたい漫画がここにある"
          />
        </h2>
        <p class="description_top">
          Next Gen Completely Transparent & Fair Comic Platform
        </p>
      </div>
    </section>

    <!-- comics -->
    <comics />

    <!-- introduction -->
    <section id="introduction">
      <h2 class="title_introduction">
        <img
          src="~/assets/title_introduction.png"
          title="What is SANCHO"
          alt="テキスト画像"
        />
      </h2>
      <ul class="wrapper_contents_introduction">
        <li class="each_ex_introduction">
          <article>
            <div class="icon_introduction">
              <img
                src="~/assets/no_money.png"
                title="for free"
                alt="テキスト画像"
              />
            </div>
            <h3 class="each_title_introduction">
              Enjoy your favorite <br />comic for free!
            </h3>
            <p class="description_introduction">
              We can see out favorite manga anytime, anywhere, for free
            </p>
          </article>
        </li>
        <li class="each_ex_introduction">
          <article>
            <div class="icon_introduction">
              <img
                src="~/assets/author.png"
                title="author"
                alt="テキスト画像"
              />
            </div>
            <h3 class="each_title_introduction">Contribute, get money!</h3>
            <p class="description_introduction">
              Gives the author the profit that it was originally unable to
              obtain due to the pirated illegal upload site
            </p>
          </article>
        </li>
        <li class="each_ex_introduction">
          <article>
            <div class="icon_introduction">
              <img
                src="~/assets/decentralization.png"
                title="decentralize"
                alt="テキスト画像"
              />
            </div>
            <h3 class="each_title_introduction">Transparent management!</h3>
            <p class="description_introduction">
              Completely non-centralized application that did not have a
              centrally managed server
            </p>
          </article>
        </li>
      </ul>
    </section>
  </div>
</template>


<script>
export default {
  components: {
    Comics: () => import("~/components/Comics.vue")
  },
  middleware: "comics"
};
</script>


<style>
@charset "UTF-8";

/* top */
#top {
  background-image: url("~assets/background_top.jpg");
  width: 100%;
  background-attachment: fixed;
  position: relative;
  height: 100vh;
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
  font-family: "Oswald", sans-serif;
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
