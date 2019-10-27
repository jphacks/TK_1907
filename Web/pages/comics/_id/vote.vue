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
        <p class="description_book_detail">
          {{ comic.Summary }}
        </p>
      </div>
    </div>
    <Candidates :candidates="candidates" />
  </div>
</template>


<script>
import { db } from "~/plugins/firebase";

export default {
  head() {
    return { title: "votes uploader" };
  },
  components: {
    Button: () => import("~/components/atoms/Button"),
    Candidates: () => import("~/components/Candidates")
  },
  data() {
    return {
      candidates: [],
      comic: {}
    };
  },
  async asyncData(context) {
    const candidates = await db
      .collection("Books")
      .doc(`${context.route.params.id}`)
      .collection("Candidates")
      .get()
      .then(querySnapShot => {
        var candy = [];
        querySnapShot.forEach(candidate => {
          let c = {
            uid: candidate.data().uid,
            name: candidate.data().name,
            photo: candidate.data().photo
          };
          candy = [...candy, c];
        });
        return { candidates: candy };
      });
    const comic = await db
      .collection("Books")
      .doc(`${context.route.params.id}`)
      .get()
      .then(documentSnapShot => {
        return documentSnapShot.data();
      });
    return { ...candidates, comic: comic };
  },
  methods: {
    vote(twitterUid) {
      return twitterUid;
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
