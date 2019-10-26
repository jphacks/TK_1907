<template>
  <div id="app">
    <section id="detail">
      <div class="wrapper_contents_detail">
        <div class="info_detail">
          <h2 class="title_book_detail">Upload manga files</h2>
          <p class="description_book_detail">Upload your manga files below.</p>
          <div class="wrapper_form_header">
          <input class="button_upload_header" type="file" v-on:change="onFileChange" multiple>
        </div>
        </div>
      </div>
    </section>

    <section id="archives">
      <ul class="wrapper_contents_archives">
        <li class="each_book_archives" v-for="(url, index) in uploadedImageURLs" :key="index">
          <article class="thumbnail_archives">
            <img :src="url">
          </article>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import ipfsAPI from 'ipfs-api'
const ipfs = ipfsAPI('localhost', '5001')
import * as neon from '@cityofzion/neon-js'
import Neon, {api, rpc, wallet, u} from '@cityofzion/neon-js'
import { sha3_256 } from 'js-sha3'

const client = new rpc.RPCClient('http://localhost:30333', '2.7.6')
const config = {
  name: 'http://127.0.0.1:30333',
  extra: {
    neoscan: 'http://127.0.0.1:4000/api/main_net'
  }
}
const privateNet = new rpc.Network(config)
Neon.add.network(privateNet)

export default {
  components: {},
  data() {
    return {
      uploadedImageURLs: [],
    }
  },
  methods :{
    onFileChange(e) {
      let uploadedImageHashes = []
      let files = e.target.files || e.dataTransfer.files;
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e) => {
          let buf = new Buffer(e.target.result)
          ipfs.files.add(buf, (err, file) => {
            if (err) {
              console.log(err);
            }
            uploadedImageHashes.push(file[0].hash);
            this.uploadedImageURLs.push('https://ipfs.io/ipfs/' + file[0].hash)
            if (files.length == uploadedImageHashes.length) {
              const json = JSON.stringify({ title: "hoge", imageHashes: uploadedImageHashes, hash: sha3_256(JSON.stringify({ title: "hoge", imageHashes: uploadedImageHashes})) })
              console.log(json)

              Neon.doInvoke({
                net: "http://127.0.0.1:30333",
                script: Neon.create.script({
                  scriptHash: this.$store.state.scriptHash, // Scripthash for the contract
                  operation: 'putData', // name of operation to perform.
                  args: [u.str2hexstring(json)]
                }),
                account: new wallet.Account(this.$store.state.privateKey),
                gas: 1
              }).then(res => {
                console.log(res);
              }).catch(e => {
                console.log(e);
              });
            }
          });
        };
        reader.readAsArrayBuffer(file);
      }
    }
  }
};
</script>

<style>

.button_upload_header {
  display: -webkit-flex;
  -webkit-justify-content: center;
  display: flex;
}

</style>
