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

<!-- detail -->
<section id="detail">
  <div class="wrapper_contents_detail">
    <div class="thumbnail_book_detail">
      <img :src="'https://ipfs.io/ipfs/'+ comic.imageHashes[0]">
    </div>
    <div class="info_detail">
      <h2 class="title_book_detail">{{ comic.title }}</h2>
      <p class="description_book_detail">黒崎一護・15歳・ユウレイの見える男。その特異な体質のわりに安穏とした日々を送っていた一護だが、突如、自らを死神と名乗る少女と遭遇、「虚」と呼ばれる悪霊に襲われる。次々と倒れる家族を前に一護は!</p>
      <div class="wrapper_form_header">
      <input class="input_key_header" type="" name="" placeholder="Enter address here." v-model="address">
      <button class="button_upload_header" v-on:click="vote">Vote</button>
      <button class="withdraw" v-on:click="withdraw">Withdraw</button>
    </div>
    </div>
  </div>
</section>

<!-- archives -->
<section id="archives">
  <ul class="wrapper_contents_archives">
    <li class="each_book_archives" v-for="(hash, index) in comic.imageHashes" :key="index">
      <article class="thumbnail_archives">
        <img :src="'https://ipfs.io/ipfs/'+ hash">
      </article>
    </li>
  </ul>
</section>

<!-- footer -->
<footer>
  <div class="wrapper_contents_footer">
    <span class="copyright">©2018 SANCHO All Rights Reserved.</span>
    <h2 class="logo_footer">
      <a href="//ginco.io" target="_blank">
        <img src="~/assets/logo_header.png" title="Ginco" alt="ロゴ画像">
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
import AddressUpload from '~/components/AddressUpload.vue'
import Neon, {api, rpc, wallet, u} from '@cityofzion/neon-js'

const config = {
  name: 'http://127.0.0.1:30333',
  extra: {
    neoscan: 'http://127.0.0.1:4000/api/main_net'
  }
}
const privateNet = new rpc.Network(config)
Neon.add.network(privateNet)

export default {
  components: {
    AddressUpload,
  },
  created() {
    for (var i = 0; i < this.$store.state.comics.length; i++) {
      if (this.$route.params.id === this.$store.state.comics[i]["hash"]) {
          this.comic = this.$store.state.comics[i]
          break
      }
    }
  },
  data() {
    return {
      comic: {},
      address: ''
    }
  },
  methods :{
    vote() {
      let account = new wallet.Account(this.$store.state.privateKey)
      Neon.doInvoke({
        net: "http://127.0.0.1:30333",
        script: Neon.create.script({
          scriptHash: this.$store.state.scriptHash, // Scripthash for the contract
          operation: 'vote', // name of operation to perform.
          args: [u.str2hexstring(this.$route.params.id), u.str2hexstring(account.address)]
        }),
        account: account,
        gas: 1
      }).then(res => {
        console.log(res);
      }).catch(e => {
        console.log(e);
      });
    },
    withdraw() {
      Neon.doInvoke({
        net: "http://127.0.0.1:30333",
        script: Neon.create.script({
          scriptHash: this.$store.state.scriptHash, // Scripthash for the contract
          operation: 'withdraw', // name of operation to perform.
          args: [u.str2hexstring(this.$route.params.id)]
        }),
        account: new wallet.Account(this.$store.state.privateKey),
        gas: 1
      }).then(res => {
        console.log(res);
      }).catch(e => {
        console.log(e);
      });
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
  font-family: 'Oswald', sans-serif;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 20px;
  width: 120px;
  text-align: center;
  font-size: 14px;
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
  font-size: 15px;
  margin-right: 10px;
}
header .balance_header {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}

/* detail */
#detail {
  width: 100%;
  height: 550px;
  padding-top: 60px;
  display: -webkit-flex;
  -webkit-flex-direction: column;
  -webkit-justify-content: center;
  flex-direction: column;
  display: flex;
  justify-content: center;
}
#detail .wrapper_contents_detail {
  display: -webkit-flex;
  display: flex;
  margin: 0 auto;
  width: 800px;
}
#detail .thumbnail_book_detail {
  width: 240px;
  border-radius: 4px;
  height: 320px;
  overflow: hidden;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, .2);
  background: #f5f5f5;
}
#detail .info_detail {
  width: 60%;
  margin-left: 60px;
  display: -webkit-flex;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#detail .title_book_detail {
  font-size: 28px;
}
#detail .description_book_detail {
  font-size: 14px;
  color: #888;
  margin-top: 16px;
}
#detail .rapper_form_header {
  display: -webkit-flex;
  -webkit-align-items: center;
  display: flex;
  align-items: center;
}
#detail .input_key_header {
  border: none;
  -webkit-appearance: none;
  border-radius: 4px;
  appearance: none;
  height: 41px;
  font-size: 13px;
  padding: 4px 10px;
  background: #fff;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, .1);
  width: 350px;
}
#detail .button_upload_header {
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
  box-shadow: 0px 15px 30px rgba(0, 0, 0, .1);
}
#detail .wrapper_form_header {
  margin-top: 50px;
}
.withdraw {
  border: solid 1px #ccc;
  color: #aaa;
  padding: 11px 0;
  font-size: 15px;
  font-family: 'Oswald', sans-serif;
  border-radius: 4px;
  text-align: center;
  margin-top: 40px;
}

/* archives */
#archives {
  padding: 0px 0 160px;
}
#archives .wrapper_contents_archives {
  letter-spacing: -.4em;
  width: 800px;
  margin: 0 auto;
}
#archives .each_book_archives {
  width: 100%;
  overflow: hidden;
  margin-bottom: 45px;
  border-radius: 4px;
  letter-spacing: normal;
  display: inline-block;
  vertical-align: top;
}
#archives .each_book_archives:nth-of-type(5n) {
  margin-right: 0%;
  margin-bottom: 4%;
}
#archives .thumbnail_archives {
  box-shadow: 0px 15px 30px rgba(0, 0, 0, .2);
  width: 100%;
  height: 480px;
  background-color: #f5f5f5;
}
#archives .thumbnail_archives > a {
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
</style>
