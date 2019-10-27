// web3オブジェクトをstoreにぶち込む

export default async function({ store }) {
  if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    const provider = window['ethereum'] || window.web3.currentProvider
    console.log(provider)
    const web3 = new Web3(provider)
    //console.log(await web3.eth.getAccounts())
    const accounts = await ethereum.enable()
    console.log(accounts)
    console.log(web3)
    //this.$store.dispatch("setWeb3", web3);
    //store.dispatch("setWeb3", web3);
  } else {
    console.log("web3 is not found")
  }
}
