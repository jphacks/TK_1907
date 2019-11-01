<template>
  <div id="app">
    <section id="detail" v-if="$device.isDesktop">
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
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="タイトル" prop="title">
              <Input v-model="formValidate.title" placeholder="例) ブラックジャックによろしく" />
            </FormItem>
            <FormItem label="巻数" prop="chapter">
              <InputNumber v-model="formValidate.chapter" :editable="false" :min="1"></InputNumber>
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
              <Button type="primary" @click="handleSubmit('formValidate')">Next</Button>
              <Button @click="handleReset('formValidate')">Reset</Button>
            </FormItem>
          </Form>
        </div>
        <div class="info_detail" v-else>
          <Button type="primary" size="large" :loading="loading" @click="upload">
            <span v-if="!loading">Upload</span>
            <LoadingSpiner v-else />
          </Button>
        </div>
      </div>
    </section>
    <section id="detail" v-else>
      <Alert style="margin: 0 5vw;" type="warning" show-icon>
        アップロードはサポートされていません
        <template slot="desc">
          PC版Marine以外からのアップロードはサポートされていません
          <br />大変お手数をおかけしますが、PC版Marineから再度お試しください
        </template>
      </Alert>
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
    } else {
      this.$Modal.error({
        title: "お使いの環境ではアップロード機能はご利用できません",
        content:
          "アップロード機能を利用するにはMetamaskのインストールが必要です",
        okText: "閉じる",
        onOk: () => {
          this.$router.push("/");
        }
      });
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
            title: "アップロード成功",
            okText: "閉じる"
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
    },
    goHome() {
      this.$router.push("/");
    }
  }
};
</script>


<style>
@charset "UTF-8";

/* detail */
#detail {
  width: 100%;
  height: 100vh;
  padding-top: 60px;
  flex-direction: column;
  display: flex;
  justify-content: center;
}
#detail .wrapper_contents_detail {
  margin: 0 auto;
  width: 800px;
}
#detail .info_detail {
  width: 100%;
  padding-top: 60px;
  display: block;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
#detail .upload_steps {
  width: 100%;
  display: block;
  flex-direction: column;
  justify-content: center;
}
#detail .title_book_detail {
  font-size: 40px;
  text-align: center;
}
#detail .description_book_detail {
  font-size: 16px;
  color: #888;
  text-align: center;
  margin-top: 10px;
}
#detail .button_upload_header {
  display: flex;
  justify-content: center;
  background: #1e5ccc;
  display: block;
  padding: 32px 0 32px 126px;
  appearance: none;
  border-radius: 100px;
  color: #fff;
  font-size: 14px;
  width: 60%;
  margin: 0 auto;
  text-align: center;
  font-weight: bold;
  border: none;
  box-shadow: 0px 15px 40px rgba(0, 0, 0, 0.2);
}
#detail .wrapper_form_header {
  margin-top: 40px;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

/* archives */
#archives {
  padding: 0px 0 80px;
}
#archives .wrapper_contents_archives {
  letter-spacing: -0.4em;
  width: 1000px;
  margin: 0 auto;
}
#archives .each_book_archives {
  width: 16.8%;
  margin-right: 4%;
  overflow: hidden;
  margin-bottom: 40px;
  border-radius: 4px;
  letter-spacing: normal;
  display: inline-block;
  vertical-align: top;
}
#archives .each_book_archives:nth-of-type(5n) {
  margin-right: 0%;
}
#archives .thumbnail_archives {
  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 180px;
  background-color: #f5f5f5;
}
#archives .thumbnail_archives > a {
  display: block;
  width: 100%;
  height: 100%;
}
.button_upload_header {
  cursor: pointer;
  display: flex;
  justify-content: center;
}
</style>
