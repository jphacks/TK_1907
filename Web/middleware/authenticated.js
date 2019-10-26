// SNS認証が必要なページで読み込む
import firebase from "@/plugins/firebase";
import "firebase/app";

export default function({ store, redirect }) {
  firebase.auth().useDeviceLanguage();
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log(user);
      // ログイン済み
      store.dispatch("login", user);
    } else {
      // 未ログイン
      redirect("/");
    }
  });
}
