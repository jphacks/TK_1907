<template>
  <div class="wrapper_form_header">
    <div class="wrapper_balance_header">
      <span class="subtitle_balance_header">NeoGas:</span>
      <span class="balance_header">{{ $store.state.neoGas }}</span>
      <div class="blank_header"></div>
      <span class="subtitle_balance_header">Address:</span>
      <span class="balance_header">{{ address }}</span>
    </div>
    <button class="button_go_header upload_add" v-on:click="goUpload">Upload</button>
  </div>
</template>

<script>
import Neon, {api, rpc, wallet, u} from '@cityofzion/neon-js'

export default {
  components: {},
  created: function() {
    const account = new wallet.Account(this.$store.state.privateKey);
    this.address = account.address;
  },
  data() {
    return {
      address: ""
    }
  },
  methods :{
    goUpload(hash) {
      this.$router.push('/upload')
    }
  }
};
</script>

<style>
.blank_header {
  width: 20px;
  height: 10px;
}
.upload_add {
  background: #fff100;
  height: 40px;
  font-family: 'Oswald', sans-serif;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 20px;
  width: 100px;
  font-size: 14px;
  text-align: center;
  font-weight: bold;
  border: none;
  margin-left: 10px;
}
</style>