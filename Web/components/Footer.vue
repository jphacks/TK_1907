<template>
  <footer>
    <div class="wrapper_contents_footer">
      <span class="copyright">©2018 Marine All Rights Reserved.</span>
      <h2 class="logo_footer">
        <a href="">
          <img src="~/assets/logo_header.png" title="Marine" alt="ロゴ画像" />
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
</template>


<style scoped>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}
footer .wrapper_right_footer {
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
