<template>
  <header>
    <div class="wrapper_contents_header">
      <h1 class="logo_header">
        <a href="/">
          <img src="~/assets/logo_header.png" title="SANCHO" alt="SANCHOロゴ" />
        </a>
      </h1>
    </div>
    <Login @click="login" />
  </header>
</template>


<script>
import firebase from "@/plugins/firebase";
import "firebase/auth";

export default {
  components: {
    Login: () => import("./Login")
  },
  methods: {
    async login() {
      var provider = new firebase.auth.TwitterAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          //   commit(
          //     "login",
          //     result.credential.accessToken,
          //     result.credential.secret,
          //     result.user
          //   );
          this.$router.push("/upload");
        })
        .catch(error => {
          console.error(error);
          // TODO: display error message
          // this.error = { ...error };

          // {
          //   code,
          //   message,
          //   email, // The email of the user's account used.
          //   credential, // The firebase.auth.AuthCredential type that was used.
          // }
        });
    }
  }
};
</script>

<style>
@charset "UTF-8";

/* header */
header {
  z-index: 9999;
  position: fixed;
  width: 100%;
  background: #000;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.3);
}
header .logo_header {
  width: 120px;
}
header .logo_header a {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
header .logo_header img {
  width: 100%;
  height: auto;
}
header .wrapper_contents_header {
  width: 1300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px auto;
  padding: 11px 0;
}
header .rapper_form_header {
  display: flex;
  align-items: center;
}

header .button_login_header {
  background: #fff100;
  height: 40px;
  font-family: "Oswald", sans-serif;
  appearance: none;
  border-radius: 20px;
  width: 110px;
  text-align: center;
  font-weight: bold;
  border: none;
  font-size: 14px;
  margin-left: 10px;
}
header .button_upload_header {
  background: #1e5ccc;
  height: 40px;
  font-family: "Oswald", sans-serif;
  appearance: none;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  width: 110px;
  text-align: center;
  font-weight: bold;
  border: none;
  margin-left: 20px;
}
</style>
