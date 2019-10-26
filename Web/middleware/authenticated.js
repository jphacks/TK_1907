import firebase from "@/plugins/firebase";

export default function({ store, redirect }) {
  firebase.auth().useDeviceLanguage();
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log(user);
      // ログイン済み
      store.dispatch("login", user);
      // TODO: firebaseのデータにアクセス
      // store.dispatch("setCommics", doc.data());
    } else {
      // 未ログイン
      redirect("/");
    }
  });
}
