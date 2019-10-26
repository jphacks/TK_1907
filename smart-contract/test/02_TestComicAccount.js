const MarineCore = artifacts.require("MarineCore");
const ComicAccount = artifacts.require("ComicAccount");
const ethabi = require("ethereumjs-abi");
const BN = require('bn.js');
const {
  vmExceptionTextRevertWithReason,
  vmExceptionTextRevert,
  makeDepositInEther,
  maxGasLimit,
  deposit,
} = require("./utils/utils.js");

contract("02_TestComicAccount", async (accounts) => {
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

  it("can get uploader", async () => {
    try {
      const uploader = await comicAccount.uploader();
      assert.strictEqual(accounts[0], uploader);
      assert(true);
    } catch(e) {
      assert(false, "Unexpected error in constructor")
    }
  });

  it("can be candidate", async () => {
    try {
      await comicAccount.beCandidate();
      await comicAccount.beCandidate({from: accounts[1]});
      await comicAccount.beCandidate({from: accounts[2]});

      let isCandidate = await comicAccount.isCandidate(accounts[0]);
      assert.strictEqual(isCandidate, true);
      isCandidate = await comicAccount.isCandidate(accounts[1]);
      assert.strictEqual(isCandidate, true);
      isCandidate = await comicAccount.isCandidate(accounts[2]);
      assert.strictEqual(isCandidate, true);

      const candidatesLength = await comicAccount.getCandidatesLength();
      for (let i = 0; i < candidatesLength; i++) {
        const candidate = await comicAccount.candidates(i);
        assert.strictEqual(candidate, accounts[i]);
      }
    } catch(e) {
      assert(false, "Unexpected error in constructor")
    }
  });

  it("can vote", async () => {
    try {
      await comicAccount.beCandidate();
      await comicAccount.beCandidate({from: accounts[1]});
      await comicAccount.beCandidate({from: accounts[2]});

      await comicAccount.vote(accounts[0]);
      let acquiredVotes = await comicAccount.acquiredVotes(accounts[0]);
      assert.strictEqual(acquiredVotes.toString(), "1");

      let currentCreator = await comicAccount.getCurrentCreator();
      assert.strictEqual(currentCreator, accounts[0]);

      await comicAccount.vote(accounts[1], {from: accounts[1]});
      await comicAccount.vote(accounts[1], {from: accounts[2]});
      acquiredVotes = await comicAccount.acquiredVotes(accounts[1]);
      assert.strictEqual(acquiredVotes.toString(), "2");

      currentCreator = await comicAccount.getCurrentCreator();
      assert.strictEqual(currentCreator, accounts[1]);
    } catch(e) {
      assert(false, "Unexpected error in constructor")
    }
  });

  it("can accept ether", async () => {
    try {
      await comicAccount.beCandidate();
      await comicAccount.vote(accounts[0]);

      await web3.eth.sendTransaction({
        from: accounts[0],
        to: comicAccount.address,
        value: "10002",
        gas: "200000",
      });

      const uploaderBalance = await comicAccount.balanceOf(0); // uploader
      console.log(uploaderBalance.toString());

      const creatorBalance = await comicAccount.balanceOf(1); // creator
      console.log(creatorBalance.toString());

      const voterBalance = await comicAccount.balanceOf(2); // voter
      console.log(voterBalance.toString());
    } catch(e) {
      console.log(e.message)
      assert(false, "Unexpected error in constructor")
    }
  });

  it("can accept ether", async () => {
    try {
      await comicAccount.beCandidate({from: accounts[1]});
      await comicAccount.vote(accounts[1], {from: accounts[2]});

      await web3.eth.sendTransaction({
        from: accounts[0],
        to: comicAccount.address,
        value: "10002",
        gas: "200000",
      });

      const beforeBalance = await web3.eth.getBalance(accounts[1]);
      const creatorBalance = await comicAccount.balanceOf(1); // creator

      await comicAccount.withdraw({from:accounts[1]});
      const afterBalance = await web3.eth.getBalance(accounts[1]);
      console.log(beforeBalance.toString());
      console.log(afterBalance.toString());
      console.log(creatorBalance.toString());
      console.log((new BN(beforeBalance, 10)).add(creatorBalance).toString())
    } catch(e) {
      console.log(e.message)
      assert(false, "Unexpected error in constructor")
    }
  });
});
