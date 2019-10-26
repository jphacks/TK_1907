const MarineCore = artifacts.require("MarineCore");
const ComicAccount = artifacts.require("ComicAccount");

contract("01_TestMarineCore", async (accounts) => {
  it("can deploy comic account", async () => {
    try {
      await MarineCore.new();
      assert(true);
    } catch(e) {
      assert(false, "Unexpected error in constructor")
    }
  });

  it("can get deployment address", async () => {
    try {
      const core = await MarineCore.new();
      const deploymentAddr = await core.getDeploymentAddress(0, accounts[0]);
      const tx = await core.createComicAccount(0);
      assert.strictEqual(deploymentAddr, tx.receipt.logs[0].args[0]);
    } catch(e) {
      assert(false, "Unexpected error in constructor")
    }
  });

  it("can set views", async () => {
    try {
      const core = await MarineCore.new();
      const tx = await core.createComicAccount(0);
      const account = await ComicAccount.at(tx.receipt.logs[0].args[0]);
      await core.setViews(account.address, 100);
      let totalViews = await core.totalViews();
      assert.strictEqual(totalViews.toString(), "100");
      let comicViews = await core.comicViews(account.address);
      assert.strictEqual(comicViews.toString(), "100");

      await core.setViews(account.address, 100);
      totalViews = await core.totalViews();
      assert.strictEqual(totalViews.toString(), "200");
      comicViews = await core.comicViews(account.address);
      assert.strictEqual(comicViews.toString(), "200");
    } catch(e) {
      assert(false, "Unexpected error in constructor")
    }
  });

  it("can accept ether", async () => {
    try {
      const core = await MarineCore.new();
      const tx = await core.createComicAccount(0);
      const account = await ComicAccount.at(tx.receipt.logs[0].args[0]);
      await core.setViews(account.address, 100);

      await web3.eth.sendTransaction({
        from: accounts[0],
        to: core.address,
        value: "10002",
        gas: "600000",
      });

    } catch(e) {
      console.log(e.message);
      assert(false, "Unexpected error in constructor")
    }
  });
});
