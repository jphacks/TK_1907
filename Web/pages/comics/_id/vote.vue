<template>
  <div>
    <section id="detail">
      <div class="wrapper_contents_detail">
        <div class="thumbnail_book_detail">
          <img :src="comic.Thumbnail" />
        </div>
        <div class="info_detail">
          <h2 class="title_book_detail">{{ comic.Title }}</h2>
          <p class="description_book_detail">{{ comic.Summary }}</p>
        </div>
      </div>
    </section>
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
            photo: candidate.data().photo,
            profile_url: `https://twitter.com/${candidate.data().screen_name}`,
            acquiredVotes: 0
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
@media screen and (max-width: 639px) {
  #detail {
    /* padding: 150px 200px 50px; */
    height: 100%;
    display: flex;
    flex-direction: center;
  }
  #detail .wrapper_contents_detail {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto;
    width: 100vw;
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
  #detail .thumbnail_book_detail {
    width: 240px;
    border-radius: 4px;
    height: 320px;
    overflow: hidden;
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
    background: #f5f5f5;
    margin-top: 10vh;
  }
  /* .detail .thumbnail_book_detail {
    width: 240px;
    border-radius: 4px;
    height: 320px;
    overflow: hidden;
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
    background: #f5f5f5;
    margin-top: 10vh;
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
  } */
}

@media only screen and (min-width: 640px) and (max-width: 1023px) {
  #detail {
    padding: 150px 200px 50px;
    height: 700px;
    display: flex;
    flex-direction: center;
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

  /* .info_detail {
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .title_book_detail {
    font-size: 23px;
    font-weight: bold;
    margin-bottom: 14px;
  } */
}

@media screen and (min-width: 1024px) {
  #detail {
    padding: 150px 200px 50px;
    height: 700px;
    display: flex;
    flex-direction: center;
  }
  #detail .wrapper_contents_detail {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    width: 100vw;
  }
  #detail .thumbnail_book_detail {
    width: max-content;
    margin-right: 100px;
    overflow: hidden;
    box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
    background: #f5f5f5;
    height: 55vh;
    width: 20vw;
  }

  #detail .info_detail {
    height: 500px;
    width: 50vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  #detail .title_book_detail {
    font-size: 23px;
    font-weight: bold;
    margin-bottom: 14px;
  }
}
</style>
