<template>
  <div>
    <!-- detail -->
    <section id="detail">
      <div class="wrapper_contents_detail">
        <div class="thumbnail_book_detail">
          <img :src="comic.thumbnail" />
        </div>
        <div class="info_detail">
          <h2 class="title_book_detail">{{ comic.title }}</h2>
          <h2 class="balance_detail">総残高 {{ balance }} ETH</h2>
          <p class="description_book_detail">{{ comic.summary }}</p>
          <div class="wrapper_form_header">
            <Button @click="() => $router.push(`/comics/${$route.params.id}/vote`)" title="投票する" />
            <Button @click="candidate" title="立候補する" />
            <Button @click="withdraw" title="引き出す" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import firebase, { db } from "~/plugins/firebase";
import { mapState, mapActions } from "vuex";
import Web3 from "web3";

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
      balance: 0
    };
  },
  middleware: "comics",
  asyncData(context) {
    // var chapters = [];
    // return db
    //   .collection("Books")
    //   .doc(`${context.route.params.id}`)
    //   .collection("Chapters")
    //   .get()
    //   .then(querySnapShot => {
    //     querySnapShot.forEach(chapter => {
    //       const chap = {
    //         chapterNumber: chapter.data().ChapterNumber,
    //         thumbnail: chapter.data().Thumbnail,
    //         title: chapter.data().Title
    //       };
    //       chapters = [...chapters, chap];
    //     });
    const comic = context.store.state.comics.filter(
      c => c.id === context.route.params.id
    );
    return { comic: comic[0], contractAddress: context.route.params.id };
    // });
  },
  mounted: async function() {
    if (
      typeof window.ethereum !== "undefined" ||
      typeof window.web3 !== "undefined"
    ) {
      const provider = window["ethereum"] || window.web3.currentProvider;
      console.log(provider);
      const web3 = new Web3(provider);
      this.web3 = web3;
      const accounts = await web3.eth.getAccounts();
      this.address = accounts[0];
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
            photo: result.user.photoURL.replace("_normal", ""),
            uid: result.user.uid,
            screen_name: result.additionalUserInfo.username,
            address: this.address
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
      console.log(this.address);
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        await this.loginTwitter();
        if (this.$store.state.user !== undefined) {
          await db
            .collection("Books")
            .doc(`${this.$route.params.id}`)
            .collection("Candidates")
            .doc(this.address)
            .set({ ...this.$store.state.user });
          try {
            await web3.eth.sendTransaction({
              from: this.address,
              to: this.contractAddress,
              gas: "1000000",
              data: "0x301fa53d" // beCandidate
            });
          } catch (e) {
            console.log(e);
          }
          this.$Modal.success({
            title: "立候補に成功しました",
            okText: "閉じる"
          });
        }
      } else {
        this.$Modal.error({
          title: "お使いの環境では立候補機能はご利用できません",
          content: "立候補機能を利用するにはMetamaskのインストールが必要です",
          okText: "閉じる"
        });
      }
    },
    async withdraw() {
      console.log(this.contractAddress);
      console.log(this.web3);
      console.log(this.comic);
      if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
      ) {
        const accounts = await this.web3.eth.getAccounts();
        console.log(accounts);
        try {
          await web3.eth.sendTransaction({
            from: accounts[0],
            to: this.contractAddress,
            gas: "1000000",
            data: "0x3ccfd60b" // withdraw
          });
          this.$Modal.success({
            title: "引き出しに成功しました",
            okText: "閉じる"
          });
        } catch (e) {
          console.log(e);
        }
      } else {
        this.$Modal.error({
          title: "お使いの環境では引き出し機能はご利用できません",
          content: "引き出し機能を利用するにはMetamaskのインストールが必要です",
          okText: "閉じる"
        });
      }
    }
  }
};
</script>


<style>
@charset "UTF-8";

@media screen and (max-width: 639px) {
  /* detail */
  #detail {
    width: 100%;
    height: 100%;
    min-height: Calc(100vh - 144px);
    padding-top: 60px;
    flex-direction: column;
    display: flex;
    justify-content: center;
  }
  #detail .wrapper_contents_detail {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto;
    width: 100vw;
  }
  #detail .thumbnail_book_detail {
    width: 240px;
    border-radius: 4px;
    height: 320px;
    overflow: hidden;
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
    background: #f5f5f5;
    margin-top: 10vh;
  }
  #detail .info_detail {
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  #detail .title_book_detail {
    font-size: 28px;
    text-align: center;
  }
  #detail .balance_detail {
    font-size: 20px;
    text-align: center;
  }
  #detail .description_book_detail {
    font-size: 14px;
    color: #888;
    margin-top: 16px;
    text-align: center;
  }
  #detail .wrapper_form_header button {
    margin: 2vh auto;
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
    margin: 50px auto;
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
}

@media only screen and (min-width: 640px) and (max-width: 1023px) {
  /* detail */
  #detail {
    width: 100%;
    height: 550px;
    min-height: Calc(100vh - 144px);
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
    margin: 50px auto;
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
}

@media screen and (min-width: 1024px) {
  /* detail */
  #detail {
    width: 100%;
    height: 550px;
    min-height: Calc(100vh - 144px);
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
  #detail .wrapper_form_header {
    margin-left: 50px;
    display: flex;
    align-items: center;
  }
  #detail .wrapper_form_header button {
    margin: 0 1vw;
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
    margin: 50px auto;
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
}
</style>
