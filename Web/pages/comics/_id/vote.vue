<template>
  <div>
    <div class="detail">
      <div class="wrapper_contents_detail">
        <div class="thumbnail_book_detail">
          <img :src="comic.Thumbnail" />
        </div>
      </div>
      <div class="info_detail">
        <h2 class="title_book_detail">{{ comic.Title }}</h2>
        <p class="description_book_detail">{{ comic.Summary }}</p>
      </div>
    </div>
    <Candidates :candidates="candidates" />
  </div>
</template>


<script>
import { db } from "~/plugins/firebase";
import Web3 from "web3";

export default {
  components: {
    Button: () => import("~/components/atoms/Button"),
    Candidates: () => import("~/components/Candidates")
  },
  data() {
    return {
      candidates: [],
      comic: {},
      web3: {},
      address: "",
      contractAddress: ""
    };
  },
  async asyncData(context) {
    const candidates = await db
      .collection("Books")
      .doc(`${context.route.params.id}`)
      .collection("Candidates")
      .get()
      .then(querySnapShot => {
        var candids = [];
        querySnapShot.forEach(async candidate => {
          let c = {
            address: candidate.id,
            uid: candidate.data().uid,
            name: candidate.data().name,
            photo: candidate.data().photo
          };
          candids = [...candids, c];
        });
        return candids;
      });
    const comic = await db
      .collection("Books")
      .doc(`${context.route.params.id}`)
      .get()
      .then(documentSnapShot => {
        return documentSnapShot.data();
      });
    return {
      candidates: candidates,
      comic: comic,
      contractAddress: context.route.params.id
    };
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
    }
  }
};
</script>

<style scoped>
div .detail {
  padding: 150px 200px 50px;
  height: 700px;
  display: flex;
  flex-direction: center;
}
.detail .thumbnail_book_detail {
  height: 500px;
  margin-right: 100px;
}
img {
  height: 500px;
}

.info_detail {
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.title_book_detail {
  font-size: 23px;
  font-weight: bold;
  margin-bottom: 14px;
}
</style>
