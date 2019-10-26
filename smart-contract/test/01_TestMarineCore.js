const MarineCore = artifacts.require("MarineCore");

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
});
