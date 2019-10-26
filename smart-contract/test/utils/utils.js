exports.deposit = 1000; // wei
exports.firstSpend = 100;
exports.secondSpend = 900;
exports.BN = web3.utils.BN;
exports.zeroAddress = "0x0000000000000000000000000000000000000000";
exports.maxGasLimit = 2000000;

// Expected Error test for a failed require()
exports.vmExceptionTextRevertWithReason = (reason) => {
  return `Returned error: VM Exception while processing transaction: revert ${reason}`;
}

exports.vmExceptionTextRevert = "Returned error: VM Exception while processing transaction: revert";

exports.makeDepositInEther = (account, address)=> {
  return web3.eth.sendTransaction({from: account, to: address, value: exports.deposit});
}

//mnemonic for test
//execute secret powder segment fit until flame echo steel foot virtual fiscal
exports.privKeys = [
  "0xd14bcbfe7dc58e6c2c5454584aa4a20a27a4c877961dcbdb97cdb93fa5daeb0f",
  "0xfc91a97a7bd8aea800b05e1b1cc6cd92da5c9df00dfb66c798f1a908f93a007a",
  "0xa5a82535357a7a0f65e416b109dd9d83fc4bdfdf9bb05337d10b2e00e984320d",
  "0x949ff1059082841c1bfd6cba7ed527e49bc0ac22fa2009ab7e3b37c98706e2d5",
  "0x42b435b35784bc6b5a3134a2de12c200126212e33f2023c626b6335cb948a9d1",
  "0x8708cfb3a7c4a72c11c4d02ba75e50bec26533e561b3605a2d03dad15851c4f7",
  "0x69cb946e7020d73bf733289ec05484ddf62831ad6d6bfd94de4e6cf1eeb9354d",
  "0x10384e409af26b8cdc59cdbab68a178f2402e531da27013f16d81f047e6e37f1",
  "0x0ed4f3506d7376c51203eb3f984db92afe4968449efe1f18bcce3cc75d8a3f32",
  "0x3ec7e8cc35d4fcbe2cf7aadab75a938501836f97c5c0c2f071efc8126435f74a",
  "0x3a8ecb169ff80d1a28dadb031c7a96c2f8a4498de488c8321cb4d8dd5ec5aa70",
];

exports.logEvents = (receipt) => {
  if(receipt.logs.length == 0) return;
  console.log("\n------------------Events------------------\n");
  for(let i = 0; i < receipt.logs.length; i++) {
    console.log(receipt.logs[i].event + ": " + JSON.stringify(receipt.logs[i].args) + "\n");
  }
  console.log("------------------------------------------\n");
}

