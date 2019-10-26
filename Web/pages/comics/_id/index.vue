<template>
  <div>
    <!-- detail -->
    <section id="detail">
      <div class="wrapper_contents_detail">
        <div class="thumbnail_book_detail">
          <img :src="comics[0].thumbnail" />
        </div>
        <div class="info_detail">
          <h2 class="title_book_detail">{{ comics[0].title }}</h2>
          <h2 class="balance_detail"> 総残高 {{ balance }} ETH </h2>
          <p class="description_book_detail">
          <!--{{ comics[0].description }}-->
          </p>
          <div class="wrapper_form_header">
            <Button @click="vote" title="投票する" />
            <Button @click="candidate" title="立候補する" />
            <Button @click="withdraw" title="引き出す" />
          </div>
        </div>
      </div>
    </section>

    <!-- archives -->
    <!-- <section id="archives">
      <ul class="wrapper_contents_archives">
        <li
          class="each_book_archives"
          v-for="(hash, index) in comic"
          :key="index"
        >
          <article class="thumbnail_archives">
            <img :src="'https://ipfs.io/ipfs/' + hash" />
          </article>
        </li>
      </ul>
    </section> -->
  </div>
</template>


<script>
import firebase, { db } from "~/plugins/firebase";
import { mapState, mapActions } from "vuex";
import Web3 from 'web3';

export default {
  components: {
    Button: () => import("~/components/atoms/Button")
  },
  data() {
    return {
      comic: {},
      contractAddress: "",
      address: "",
      web3: null,
      balance: 0,
    };
  },
  middleware: "comics",
  asyncData(context) {
    var chapters = [];
    return db.collection("Books")
      .doc(`${context.route.params.id}`)
      .collection("Chapters")
      .get()
      .then(querySnapShot => {
        querySnapShot.forEach(chapter => {
          const chap = {
            chapterNumber: chapter.data().ChapterNumber,
            thumbnail: chapter.data().Thumbnail,
            title: chapter.data().Title
          };
          chapters = [...chapters, chap];
        });
        return { comic: chapters, contractAddress: context.route.params.id };
      });
  },
  web3: null,
  mounted: async function() {
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
      const provider = window['ethereum'] || window.web3.currentProvider
      console.log(provider)
      const web3 = new Web3(provider)
      this.web3 = web3;
      const balance = await web3.eth.getBalance(this.contractAddress);
      const balanceInEther = web3.utils.fromWei(balance, "ether");
      this.balance = balanceInEther;
    }
  },
  // middleware: "web3",
  computed: mapState(["comics"]),
  methods: {
    ...mapActions(["login"]),
    async loginTwitter() {
      var provider = new firebase.auth.TwitterAuthProvider();
      await firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          this.login({
            name: result.user.displayName,
            photo: result.user.photoURL,
            uid: result.user.uid
          });
          // this.$router.push("/upload");
        })
        .catch(error => {
          console.error(error);
          // TODO: display error message
          // this.error = { ...error };
          // {
          //   code,
          //   message,
          //   email, // The email of the user's account used.
          //   credential, // The firebase.auth.AuthCredential type that was used.
          // }
        });
    },
    async candidate() {
      await this.loginTwitter();
      await db
        .collection("Books")
        .doc(`${this.$route.params.id}`)
        .collection("Candidates")
        .add({ ...this.$store.state.user });
    },
    async vote() {
			// TODO 投票先を取得する
      const accounts = await this.web3.eth.getAccounts()
      console.log(accounts)
      try {
        await web3.eth.sendTransaction({
          from: accounts[0],
          to: this.contractAddress,
          gas: "1000000",
          data: "0x6dd7d8ea", // vote
        });
      } catch(e) {
        console.log(e);
      }
    },
    async withdraw() {
      console.log(this.contractAddress)
      console.log(this.web3)
      console.log(this.comic)
      const accounts = await this.web3.eth.getAccounts()
      console.log(accounts)
      try {
        await web3.eth.sendTransaction({
          from: accounts[0],
          to: this.contractAddress,
          gas: "1000000",
          data: "0x3ccfd60b", // withdraw
        });
      } catch(e) {
        console.log(e);
      }
    }
  }
};
</script>


<style>
@charset "UTF-8";

/* detail */
#detail {
  width: 100%;
  height: 550px;
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
#detail .thumbnail_book_detail {
  width: 240px;
  border-radius: 4px;
  height: 320px;
  overflow: hidden;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
  background: #f5f5f5;
}
#detail .info_detail {
  width: 60%;
  margin-left: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#detail .title_book_detail {
  font-size: 28px;
}
#detail .balance_detail {
  font-size: 20px;
  text-align: center;
}
#detail .description_book_detail {
  font-size: 14px;
  color: #888;
  margin-top: 16px;
}
#detail .rapper_form_header {
  margin-left: 50px;
  display: flex;
  align-items: center;
}
#detail .input_key_header {
  border: none;
  border-radius: 4px;
  appearance: none;
  height: 41px;
  font-size: 13px;
  padding: 4px 10px;
  background: #fff;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.1);
  width: 350px;
}
#detail .button_upload_header {
  background: #1e5ccc;
  height: 40px;
  font-family: "Oswald", sans-serif;
  appearance: none;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  width: 110px;
  text-align: center;
  font-weight: bold;
  border: none;
  margin-left: 20px;
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.1);
}
#detail .wrapper_form_header {
  margin-top: 50px;
}
.withdraw {
  border: solid 1px #ccc;
  color: #aaa;
  padding: 11px 0;
  font-size: 15px;
  font-family: "Oswald", sans-serif;
  border-radius: 4px;
  text-align: center;
  margin-top: 40px;
}
</style>
