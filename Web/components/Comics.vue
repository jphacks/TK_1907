<template>
  <section id="archives">
    <ul class="wrapper_contents_archives">
      <li
        class="each_book_archives"
        v-for="(comic, index) in $store.state.comics"
        :key="index"
      >
        <article class="thumbnail_archives">
          <div @click="goDetail(comic.id)">
            <img :src="comic.thumbnail" />
          </div>
        </article>
      </li>
    </ul>
  </section>
</template>


<script>
import Neon, { api, rpc, wallet, u } from "@cityofzion/neon-js";

// async function getComics(shash) {
//   const props = {
//     scriptHash: shash, // Scripthash for the contract
//     operation: "getData", // name of operation to perform.
//     args: [] // any optional arguments to pass in. If null, use empty array.
//   };
//   let script = Neon.create.script(props);
//   let res = await rpc.Query.invokeScript(Neon.create.script(props)).execute(
//     "http://localhost:30333"
//   );
//   return JSON.parse("[" + u.hexstring2str(res.result.stack[0].value) + "]");
// }

export default {
  // async beforeCreate() {
  //   let comics = await getComics(this.$store.state.scriptHash);
  //   this.$store.commit("setComics", comics);
  // },
  methods: {
    goDetail(id) {
      this.$router.push("/comics/" + id);
    }
  }
};
</script>
