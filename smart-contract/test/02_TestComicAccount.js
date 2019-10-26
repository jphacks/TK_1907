const MarineCore = artifacts.require("MarineCore");
const ComicAccount = artifacts.require("ComicAccount");
const ethabi = require("ethereumjs-abi");
const {
  vmExceptionTextRevertWithReason,
  vmExceptionTextRevert,
  makeDepositInEther,
  maxGasLimit,
} = require("./utils/utils.js");

contract.only("02_TestComicAccount", async (accounts) => {
  let comicAccount;
  beforeEach(async () => {
    try {
      const core = await MarineCore.new();
      const tx = await core.createComicAccount(0);
      comicAccount = await ComicAccount.at(tx.receipt.logs[0].args[0]);
    } catch(e) {
      assert(false, "Unexpected error in constructor: " + e.message);
    }
  });

  it("can deploy comic account", async () => {
    try {
      await MarineCore.new();
      assert(true);
    } catch(e) {
      assert(false, "Unexpected error in constructor")
    }
  });
});
