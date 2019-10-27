<template>
  <div id="app">
    <section id="detail">
      <div class="wrapper_contents_detail">
        <div class="upload_steps">
          <Steps :current="current">
            <Step title="ファイルの選択" icon="ios-document"></Step>
            <Step title="詳細の入力" icon="ios-brush"></Step>
            <Step title="アップロード" icon="ios-cloud"></Step>
          </Steps>
        </div>
        <div class="info_detail" v-if="current === 0">
          <h2 class="title_book_detail">Upload manga files</h2>
          <p class="description_book_detail">Upload your manga files below.</p>
          <div class="wrapper_form_header">
            <input
              class="button_upload_header"
              type="file"
              @change="onFileChange"
              accept="application/zip"
              multiple
            />
          </div>
        </div>
        <div class="info_detail" v-else-if="current === 1">
          <Form
            ref="formValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="80"
          >
            <FormItem label="タイトル" prop="title">
              <Input
                v-model="formValidate.title"
                placeholder="例) ブラックジャックによろしく"
              />
            </FormItem>
            <FormItem label="巻数" prop="chapter">
              <InputNumber
                v-model="formValidate.chapter"
                :editable="false"
                :min="1"
              ></InputNumber>
            </FormItem>
            <FormItem label="概要" prop="summary">
              <Input
                v-model="formValidate.summary"
                :maxlength="200"
                show-word-limit
                type="textarea"
                placeholder="「医者って一体、なんなんだ？」
超一流の永禄大学附属病院の研修医・斉藤英二郎、月収わずか３万８千円。"
              />
            </FormItem>
            <FormItem style="float: right;">
              <Button type="primary" @click="handleSubmit('formValidate')"
                >Next</Button
              >
              <Button @click="handleReset('formValidate')">Reset</Button>
            </FormItem>
          </Form>
        </div>
        <div class="info_detail" v-else>
          <Button
            type="primary"
            size="large"
            :loading="loading"
            @click="upload"
          >
            <span v-if="!loading">Upload</span>
            <LoadingSpiner v-else />
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import { Steps, Step, Button } from "view-design";
import Web3 from "web3";

const apiEndPoint = "https://api-server-o57wjya6va-an.a.run.app/uploadMedia";

export default {
  components: {
    LoadingSpiner: () => import("./atoms/LoadingSpiner")
  },
  data() {
    return {
      current: 0,
      loading: false,
      formValidate: {
        title: "",
        chapter: 1,
        summary: ""
      },
      web3: null,
      sender: "0x00192fb10df37c9fb26829eb2cc623cd1bf599e8",
      nonce: 0,
      file: undefined,
      ruleValidate: {
        title: [
          {
            required: true,
            message: "タイトルを入力してください",
            trigger: "blur"
          }
        ],
        chapter: [
          {
            required: true,
            message: "巻数を指定してください"
          }
        ],
        summary: [
          {
            required: true,
            message: "概要を入力してください",
            trigger: "blur"
          }
        ]
      }
    };
  },
  asyncData(context) {
    return { contractAddress: context.route.params.id };
  },
  mounted: async function() {
    if (
      typeof window.ethereum !== "undefined" ||
      typeof window.web3 !== "undefined"
    ) {
      const provider = window["ethereum"] || window.web3.currentProvider;
      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      this.web3 = web3;
      this.sender = accounts[0];
      const nonce = await web3.eth.getTransactionCount(accounts[0]);
      console.log("nonce: ", nonce);
      this.nonce = nonce;
    }
  },
  methods: {
    next() {
      if (this.current == 3) {
        this.current = 0;
      } else {
        this.current += 1;
      }
    },
    async upload() {
      this.loading = true;
      const salt = this.web3.eth.abi
        .encodeParameter("uint256", this.nonce)
        .slice(2);
      try {
        await web3.eth.sendTransaction({
          from: this.sender,
          //to: this.contractAddress,
          to: "0x803e9aD57c90d48FA9F9e3F11dEd6970B9c52D09",
          gas: "3000000",
          data: "0xacb1250d" + salt // createComicAccount
        });
      } catch (e) {
        console.log(e);
      }
      const params = new FormData();
      params.append("file", this.file);
      params.append("title", this.formValidate.title);
      params.append("chapter", this.formValidate.chapter);
      params.append("summary", this.formValidate.summary);
      params.append("sender", this.sender);
      params.append("nonce", this.nonce);
      const response = this.$axios
        .$post(apiEndPoint, params, {
          headers: {
            "content-type": "multipart/form-data"
          }
        })
        .then(response => {
          console.log("response data", response);
          this.loading = false;
          this.$Modal.success({
            title: "アップロード成功"
          });
        })
        .catch(error => {
          console.log("response error", error);
        });
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      for (let file of files) {
        this.file = file;
      }
      this.current++;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.current++;
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>


<style>
.button_upload_header {
  cursor: pointer;
  display: flex;
  justify-content: center;
}
</style>
