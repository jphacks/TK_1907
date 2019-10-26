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
          <p class="description_book_detail">
            黒崎一護・15歳・ユウレイの見える男。その特異な体質のわりに安穏とした日々を送っていた一護だが、突如、自らを死神と名乗る少女と遭遇、「虚」と呼ばれる悪霊に襲われる。次々と倒れる家族を前に一護は!
          </p>
          <div class="wrapper_form_header">
            <Button @click="vote" title="投票する" />
            <Button @click="candidate" title="ログインして立候補する" />
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

export default {
  components: {
    Button: () => import("~/components/atoms/Button")
  },
  data() {
    return {
      comic: {},
      address: ""
    };
  },
  middleware: "comics",
  asyncData(context) {
    var chapters = [];
    db.collection("Books")
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
        return { comic: chapters };
      });
  },
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
    vote() {
      let account = new wallet.Account(this.$store.state.privateKey);
      Neon.doInvoke({
        net: "http://127.0.0.1:30333",
        script: Neon.create.script({
          scriptHash: this.$store.state.scriptHash, // Scripthash for the contract
          operation: "vote", // name of operation to perform.
          args: [
            u.str2hexstring(this.$route.params.id),
            u.str2hexstring(account.address)
          ]
        }),
        account: account,
        gas: 1
      })
        .then(res => console.log(res))
        .catch(e => console.log(e));
    },
    withdraw() {
      Neon.doInvoke({
        net: "http://127.0.0.1:30333",
        script: Neon.create.script({
          scriptHash: this.$store.state.scriptHash, // Scripthash for the contract
          operation: "withdraw", // name of operation to perform.
          args: [u.str2hexstring(this.$route.params.id)]
        }),
        account: new wallet.Account(this.$store.state.privateKey),
        gas: 1
      })
        .then(res => console.log(res))
        .catch(e => console.log(e));
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
#detail .description_book_detail {
  font-size: 14px;
  color: #888;
  margin-top: 16px;
}
#detail .rapper_form_header {
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
