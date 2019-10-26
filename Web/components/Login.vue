<template>
  <div id="login">
    <div class="wrapper_form">
      <input class="input_key" type="" name="" placeholder="Enter your private key here." v-model="privateKey">
      <button class="button_go" v-on:click="login">GO</button>
    </div>
  </div>
</template>

<script>
import Neon, {api, rpc, wallet, u} from '@cityofzion/neon-js'

const config = {
  name: 'PrivateNet',
  extra: {
    neoscan: 'http://127.0.0.1:4000/api/main_net'
  }
}
const privateNet = new rpc.Network(config)
Neon.add.network(privateNet)

export default {
  data() {
    return {
      privateKey: "",
      isLogin: false
    }
  },
  methods :{
    login: async function () {
      const account = new wallet.Account(this.privateKey);
      this.$store.commit('login', account.privateKey)
      const balance = await api.neoscan.getBalance('PrivateNet', account.address)
      this.$store.commit('setNeoGas', balance.assets.GAS.balance.toString())
      this.$router.push('/comics')
    }
  },
};
</script>


<style>
@charset "UTF-8";

#login {
  margin-top: 40px;
}
.wrapper_form {
  display: -webkit-flex;
  -webkit-align-items: center;
  -webkit-justify-content: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.input_key {
  border: none;
  box-shadow: 0px 5px 30px rgba(0, 0, 0, .2);
  -webkit-appearance: none;
  border-radius: 4px;
  appearance: none;
  height: 60px;
  font-size: 16px;
  padding: 4px 16px;
  background: #fff;
  width: 460px;
}
.button_go {
  background: #fff100;
  height: 60px;
  font-family: 'Oswald', sans-serif;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 80px;
  width: 160px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0px 5px 30px rgba(0, 0, 0, .2);
  border: none;
  font-size: 16px;
  margin-left: 16px;
}

</style>
