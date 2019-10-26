const MarineCore = artifacts.require("./MarineCore.sol");

module.exports = async (deployer, network, accounts) => {
  deployer.then(async () => {
    await deployer.deploy(MarineCore);
  })
};
