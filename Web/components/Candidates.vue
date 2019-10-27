<template>
  <div id="acounts">
    <ul class="wrapper_contents_acounts">
      <li v-for="(candidate, index) in candidates" :key="index" class="each_user_acounts">
        <article class="user_icon_acounts">
          <span class="user_name_acounts">{{ candidate.name }}</span>
          <UserIcon :src="candidate.photo" />
          <span class="user_name_acounts">得票数 {{ candidate.acquiredVotes }}</span>
          <Button @click="vote(candidate.address)" title="投票する" />
        </article>
      </li>
    </ul>
  </div>
</template>


<script>
import Web3 from "web3";

export default {
  components: {
    UserIcon: () => import("~/components/atoms/UserIcon.vue"),
    Button: () => import("~/components/atoms/Button")
  },
  data() {
    return {
      web3: {}
    };
  },
  props: {
    candidates: {
      type: Array,
      required: true
    }
  },
  asyncData(context) {},
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
      for (let i = 0; i < this.candidates.length; i++) {
        const acquiredVotes = await this.web3.eth.call({
          from: this.address,
          to: this.contractAddress,
          data: "0x093825ec" + this.candidates[i].address.slice(2) // acquiredVotes
        });
        this.candidates[i].acquiredVotes = parseInt(acquiredVotes, 10);
        console.log(this.candidates[i]);
      }
    }
  },
  methods: {
    async vote(address) {
      const accounts = await this.web3.eth.getAccounts();
      console.log(accounts);
      try {
        await this.web3.eth.sendTransaction({
          from: this.address,
          to: this.contractAddress,
          gas: "1000000",
          data:
            "0x6dd7d8ea" +
            this.web3.eth.abi.encodeParameter("address", address).slice(2) // vote
        });
        this.$Modal.success({
          title: "投票に成功しました",
          okText: "閉じる"
        });
      } catch (e) {
        console.log(e);
      }
      return address;
    }
  }
};
</script>


<style scoped>
#acounts {
  padding: 100px 0;
  width: 100vw;
  overflow-x: scroll;
}
#acounts .wrapper_contents_acounts {
  min-width: 800px;
  padding: 0;
  margin: 0 150px;
  height: 100%;
  display: flex;
}
.each_user_acounts {
  height: 100%;
  width: 200px;
  margin: 0 0 30px;
}
.user_icon_acounts {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user_name_acounts {
  text-align: center;
}
</style>
