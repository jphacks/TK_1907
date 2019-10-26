// SNS認証が必要なページで読み込む
import { db } from "@/plugins/firebase";

export default async function({ store }) {
  var dbcomics = [];
  await db
    .collection("Books")
    .get()
    .then(querySnapShot => {
      querySnapShot.forEach(contractAddress => {
        const comic = {
          id: contractAddress.id,
          title: contractAddress.data().Title,
          thumbnail: contractAddress.data().Thumbnail,
          pv: contractAddress.data().PV
        };
        dbcomics = [...dbcomics, comic];
      });
      store.dispatch("setComics", dbcomics);
    });
}
