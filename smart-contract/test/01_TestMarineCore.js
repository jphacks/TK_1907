const MarineCore = artifacts.require("MarineCore");
const ethabi = require("ethereumjs-abi");
const {
  vmExceptionTextRevertWithReason,
  vmExceptionTextRevert,
  makeDepositInEther,
  maxGasLimit,
} = require("./utils/utils.js");

contract("01_TestMarineCore", async (accounts) => {
  it("does not raise an error without any arguments", async () => {
    try {
      await MultiSigMofNFactory.new();
      assert(true);
    } catch(e) {
      assert(false, "Unexpected error in constructor")
    }
  });
  //contract("", async () => {
    //it("does not raise an error without any arguments", async () => {
      //try {
        //await MultiSigMofNFactory.new();
        //assert(true);
      //} catch(e) {
        //assert(false, "Unexpected error in constructor")
      //}
    //});

    //it("raises an error with a argument", async () => {
      //try {
        //await MultiSigMofNFactory.new(accounts[1]);
        //assert(false, "expected error in constructor")
      //} catch(e) {
        //assert.equal(e.message, "Invalid number of parameters for \"undefined\". Got 1 expected 0!");
      //}
    //});
  //});
});
