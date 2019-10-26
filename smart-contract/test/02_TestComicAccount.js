const MultiSigMofN = artifacts.require("MultiSigMofN");
const Forwarder = artifacts.require("Forwarder");
const TestERC20 = artifacts.require("TestERC20");
const TestERC223 = artifacts.require("TestERC223");
const TestERC721 = artifacts.require("TestERC721");
const ethabi = require("ethereumjs-abi");
const {
  deposit,
  firstSpend,
  secondSpend,
  BN,
  tokenAddressEther,
  maxGasLimit,
  vmExceptionTextRevertWithReason,
  makeDepositInEther,
  makeDepositInErc20,
  makeDepositInErc223,
  makeDepositInErc721,
  sendMofNSpendTransaction,
  sendMofNSpendERC721Transaction,
  privKeys,
} = require("./utils/utils.js");

contract("03_TestMultiSigMofN", async (accounts) => {
  contract("When constructing", async () => {
    it("does not raise error without any arguments", async () => {
      try {
        await MultiSigMofN.new();
        assert(true);
      } catch(e) {
        assert.fail("Unexpected error in constructor: " + e.message);
      }
    });

    it("raises an error with a single argument", async () => {
      try {
        await MultiSigMofN.new(accounts[1]);
        assert.fail("Expected error in constructor")
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(e.message, "Invalid number of parameters for \"undefined\". Got 1 expected 0!");
      }
    });

    it("raise error with two arguments", async () => {
      try {
        await MultiSigMofN.new(accounts[0], accounts[1]);
        assert.fail("Expected error in constructor")
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(e.message, "Invalid number of parameters for \"undefined\". Got 2 expected 0!");
      }
    });
  });

  contract("When initializing", async () => {
    let testContract;

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
      } catch(e) {
        assert.fail("Unexpected error in constructor: " + e.message);
      }
    });

    it("raises an error without any arguments", async () => {
      try {
        await testContract.initialize();
        assert.fail("Expected error when initializing with no arguments")
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(e.message, "Invalid number of parameters for \"initialize\". Got 0 expected 2!");
      }
    });

    it("raises an error with only one argument", async () => {
      try {
        await testContract.initialize(accounts);
        assert.fail("Expected error when initializing with only one argument")
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(e.message, "Invalid number of parameters for \"initialize\". Got 1 expected 2!");
      }
    });

    it("raises an error when owners' address is zero address", async () => {
      try {
        await testContract.initialize(["0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000"], 1);
        assert.fail("Expected error when owners' address is zero address")
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Owner address cannot be zero address.")));
      }
    });

    it("raises an error with two arguments but when signerNum is 0", async () => {
      try {
        await testContract.initialize(accounts, 0);
        assert.fail("Expected error when initializing with signerNum 0")
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("SignerNum has to be greater than zero.")));
      }
    });

    it("raises an error with two arguments but same signers were given", async () => {
      try {
        await testContract.initialize([accounts[0], accounts[0]], 2);
        assert.fail("Expected error when same signers were given")
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Owners must be different address.")));
      }
    });

    it("raises an error with two arguments but when signerNum is greater than the number of owners", async () => {
      try {
        await testContract.initialize([accounts[0]], 2);
        assert.fail("Expected error when initializing with signerNum is greater than the number of owners")
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("SignerNum cannot be greater than owners.")));
      }
    });

    it("does not raise error with two valid arguments: 1 of 2", async () => {
      try {
        await testContract.initialize([accounts[0], accounts[1]], 1);

        const initialized = await testContract.initialized.call()
        assert.strictEqual(initialized, true);
        const signerNum = await testContract.signerNum.call()
        assert.strictEqual(signerNum.toString(), "1");
        assert(true);
      } catch(e) {
        assert.fail("Unexpected error when initializing: " + e.message);
      }
    });

    it("does not raise error with two valid arguments: 2 of 2", async () => {
      try {
        await testContract.initialize([accounts[0], accounts[2]], 2);

        const initialized = await testContract.initialized.call()
        assert.strictEqual(initialized, true);
        const signerNum = await testContract.signerNum.call()
        assert.strictEqual(signerNum.toString(), "2");
        assert(true);
      } catch(e) {
        assert.fail("Unexpected error when initializing: " + e.message);
      }
    });

    it("does not raise error with two valid arguments: 3 of 5", async () => {
      try {
        const owners = [accounts[0], accounts[1], accounts[2], accounts[3], accounts[4]];
        await testContract.initialize(owners, 3);

        const initialized = await testContract.initialized.call()
        assert.strictEqual(initialized, true);
        const signerNum = await testContract.signerNum.call()
        assert.strictEqual(signerNum.toString(), "3");
        assert(true);
      } catch(e) {
        assert.fail("Unexpected error when initializing: " + e.message);
      }
    });

    it("does not raise error with two valid arguments: 10 of 10", async () => {
      try {
        const owners = accounts.slice(0, 10);
        await testContract.initialize(owners, 10);

        const initialized = await testContract.initialized.call()
        assert.strictEqual(initialized, true);
        const signerNum = await testContract.signerNum.call()
        assert.strictEqual(signerNum.toString(), "10");
        assert(true);
      } catch(e) {
        assert.fail("Unexpected error when initializing: " + e.message);
      }
    });
  });

  contract("After initialization", async () => {
    let testContract;

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize([accounts[0], accounts[1]], 2);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("cannot be initialized", async () => {
      try {
        await testContract.initialize([accounts[0], accounts[1]], 2);
        assert.fail("expected error");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("This contract has already been initialized.")));
      };
    });
  });

  contract("When first created: accepting funds: 2of2", async () => {
    let testContract;
    let erc20;
    let erc223;
    let erc721;
    let erc721TokenId;

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize([accounts[0], accounts[1]], 2);
        erc20 = await TestERC20.new();
        await erc20.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc223 = await TestERC223.new();
        await erc223.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc721 = await TestERC721.new("test", "tst");
        erc721TokenId = 1;
        await erc721.mint(accounts[0], erc721TokenId);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("has a zero spendnonce value", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        assert.strictEqual(nonce.toString(), "0");
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in ether", async () => {
      try {
        const before = await web3.eth.getBalance(testContract.address);
        await makeDepositInEther(accounts[0], testContract.address);
        const after = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(before.toString(), "0");
        assert.strictEqual(after.toString(), deposit.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("cannot accept funds in ether with data", async () => {
      try {
        const before = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(before.toString(), "0");
        await web3.eth.sendTransaction({from: accounts[0], to: testContract.address, value: deposit, data: "0x123"});
        assert.fail("expected error");
      } catch(e) {
        console.error(e.message);
        const after = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(after.toString(), "0");
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("msg.data is not empty.")));
      };
    });

    it("can accept funds in erc20", async () => {
      try {
        const before = await erc20.balanceOf(testContract.address);
        await makeDepositInErc20(accounts[0], erc20, testContract.address);
        const after = await erc20.balanceOf(testContract.address);
        assert.strictEqual(before.toString(), "0");
        assert.strictEqual(after.toString(), deposit.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc223", async () => {
      try {
        const before = await erc223.balanceOf.call(testContract.address);
        await makeDepositInErc223(accounts[0], erc223, testContract.address);
        const after = await erc223.balanceOf.call(testContract.address);
        assert.strictEqual(before.toString(), "0");
        assert.strictEqual(after.toString(), deposit.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc721", async () => {
      try {
        const beforeOwner= await erc721.ownerOf.call(erc721TokenId);
        const beforeBalance = (await erc721.balanceOf.call(testContract.address)).toString();
        assert.strictEqual(beforeOwner, accounts[0]);
        assert.strictEqual(beforeBalance, "0");

        await makeDepositInErc721(accounts[0], erc721, testContract.address, erc721TokenId);

        const afterOwner= await erc721.ownerOf.call(erc721TokenId);
        const afterBalance = (await erc721.balanceOf.call(testContract.address)).toString();
        assert.strictEqual(afterOwner, testContract.address);
        assert.strictEqual(afterBalance, "1");
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("emits a 'Funded' event when accepting funds", async () => {
      try {
        const result = await testContract.sendTransaction({
          from: accounts[0],
          to: testContract.address,
          value: deposit
        });
        assert.strictEqual(result.logs[0].event, "Funded");
        assert.strictEqual(result.logs[0].args._newBalance.toString(), deposit.toString());
      } catch(e) {
        return assert.fail("Unexpected error: " + e.message);
      }
    });
  });

  contract("When first created: accepting funds: 2of3", async () => {
    let testContract;
    let erc20;
    let erc223;
    let erc721;
    let erc721TokenId;

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize([accounts[0], accounts[1], accounts[2]], 2);
        erc20 = await TestERC20.new();
        await erc20.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc223 = await TestERC223.new();
        await erc223.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc721 = await TestERC721.new("test", "tst");
        erc721TokenId = 1;
        await erc721.mint(accounts[0], erc721TokenId);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("has a zero spendnonce value", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        assert.strictEqual(nonce.toString(), "0");
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in ether", async () => {
      try {
        const before = await web3.eth.getBalance(testContract.address);
        await makeDepositInEther(accounts[0], testContract.address);
        const after = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(before.toString(), "0");
        assert.strictEqual(after.toString(), deposit.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("cannot accept funds in ether with data", async () => {
      try {
        const before = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(before.toString(), "0");
        await web3.eth.sendTransaction({from: accounts[0], to: testContract.address, value: deposit, data: "0x123"});
        assert.fail("expected error");
      } catch(e) {
        console.error(e.message);
        const after = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(after.toString(), "0");
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("msg.data is not empty.")));
      };
    });

    it("can accept funds in erc20", async () => {
      try {
        const before = await erc20.balanceOf(testContract.address);
        await makeDepositInErc20(accounts[0], erc20, testContract.address);
        const after = await erc20.balanceOf(testContract.address);
        assert.strictEqual(before.toString(), "0");
        assert.strictEqual(after.toString(), deposit.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc223", async () => {
      try {
        const before = await erc223.balanceOf.call(testContract.address);
        await makeDepositInErc223(accounts[0], erc223, testContract.address);
        const after = await erc223.balanceOf.call(testContract.address);
        assert.strictEqual(before.toString(), "0");
        assert.strictEqual(after.toString(), deposit.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc721", async () => {
      try {
        const beforeOwner= await erc721.ownerOf.call(erc721TokenId);
        const beforeBalance = (await erc721.balanceOf.call(testContract.address)).toString();
        assert.strictEqual(beforeOwner, accounts[0]);
        assert.strictEqual(beforeBalance, "0");

        await makeDepositInErc721(accounts[0], erc721, testContract.address, erc721TokenId);

        const afterOwner= await erc721.ownerOf.call(erc721TokenId);
        const afterBalance = (await erc721.balanceOf.call(testContract.address)).toString();
        assert.strictEqual(afterOwner, testContract.address);
        assert.strictEqual(afterBalance, "1");
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("emits a 'Funded' event when accepting funds", async () => {
      try {
        const result = await testContract.sendTransaction({
          from: accounts[0],
          to: testContract.address,
          value: deposit
        });
        assert.strictEqual(result.logs[0].event, "Funded");
        assert.strictEqual(result.logs[0].args._newBalance.toString(), deposit.toString());
      } catch(e) {
        return assert.fail("Unexpected error: " + e.message);
      }
    });
  });

  contract("When first created: accepting funds: 10of10", async () => {
    let testContract;
    let erc20;
    let erc223;
    let erc721;
    let erc721TokenId;

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize(accounts.slice(0, 10), 10);
        erc20 = await TestERC20.new();
        await erc20.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc223 = await TestERC223.new();
        await erc223.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc721 = await TestERC721.new("test", "tst");
        erc721TokenId = 1;
        await erc721.mint(accounts[0], erc721TokenId);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("has a zero spendnonce value", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        assert.strictEqual(nonce.toString(), "0");
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in ether", async () => {
      try {
        const before = await web3.eth.getBalance(testContract.address);
        await makeDepositInEther(accounts[0], testContract.address);
        const after = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(before.toString(), "0");
        assert.strictEqual(after.toString(), deposit.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("cannot accept funds in ether with data", async () => {
      try {
        const before = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(before.toString(), "0");
        await web3.eth.sendTransaction({from: accounts[0], to: testContract.address, value: deposit, data: "0x123"});
        assert.fail("expected error");
      } catch(e) {
        console.error(e.message);
        const after = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(after.toString(), "0");
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("msg.data is not empty.")));
      };
    });

    it("can accept funds in erc20", async () => {
      try {
        const before = await erc20.balanceOf(testContract.address);
        await makeDepositInErc20(accounts[0], erc20, testContract.address);
        const after = await erc20.balanceOf(testContract.address);
        assert.strictEqual(before.toString(), "0");
        assert.strictEqual(after.toString(), deposit.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc223", async () => {
      try {
        const before = await erc223.balanceOf.call(testContract.address);
        await makeDepositInErc223(accounts[0], erc223, testContract.address);
        const after = await erc223.balanceOf.call(testContract.address);
        assert.strictEqual(before.toString(), "0");
        assert.strictEqual(after.toString(), deposit.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc721", async () => {
      try {
        const beforeOwner= await erc721.ownerOf.call(erc721TokenId);
        const beforeBalance = (await erc721.balanceOf.call(testContract.address)).toString();
        assert.strictEqual(beforeOwner, accounts[0]);
        assert.strictEqual(beforeBalance, "0");

        await makeDepositInErc721(accounts[0], erc721, testContract.address, erc721TokenId);

        const afterOwner= await erc721.ownerOf.call(erc721TokenId);
        const afterBalance = (await erc721.balanceOf.call(testContract.address)).toString();
        assert.strictEqual(afterOwner, testContract.address);
        assert.strictEqual(afterBalance, "1");
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("emits a 'Funded' event when accepting funds", async () => {
      try {
        const result = await testContract.sendTransaction({
          from: accounts[0],
          to: testContract.address,
          value: deposit
        });
        assert.strictEqual(result.logs[0].event, "Funded");
        assert.strictEqual(result.logs[0].args._newBalance.toString(), deposit.toString());
      } catch(e) {
        return assert.fail("Unexpected error: " + e.message);
      }
    });
  });

  contract("When first created: generating message: 2of2", async () => {
    let testContract;
    let erc20;
    let erc223;
    let erc721;
    let erc721TokenId;

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize([accounts[0], accounts[1]], 2);
        erc20 = await TestERC20.new();
        erc223 = await TestERC223.new();
        erc721 = await TestERC721.new("test", "tst");
        erc721TokenId = 1;
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("returns the expected message to sign for ether", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const value = deposit;
        const destination = new BN(accounts[4].slice(2), 16);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "uint256", "address", "uint256" ],
            [ contractAddress, destination, value, tokenAddressEther, nonce ]
          )
        );
        const messageToSign = await testContract.generateMessageToSign(accounts[4], deposit, tokenAddressEther, nonce);
        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("returns the expected message to sign for erc20", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const value = deposit;
        const destination = new BN(accounts[4].slice(2), 16);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "uint256", "address", "uint256" ],
            [ contractAddress, destination, value, erc20.address, nonce ]
          )
        );
        const messageToSign = await testContract.generateMessageToSign(accounts[4], deposit, erc20.address, nonce);
        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error in constructor: " + e.message);
      }
    });

    it("returns the expected message to sign for erc223", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const value = deposit;
        const destination = new BN(accounts[4].slice(2), 16);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "uint256", "address", "uint256" ],
            [ contractAddress, destination, value, erc223.address, nonce ]
          )
        );
        const messageToSign = await testContract.generateMessageToSign(accounts[4], deposit, erc223.address, nonce);
        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("returns the expected message to sign for erc721", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const destination = new BN(accounts[4].slice(2), 16);
        const tokenId = new BN(erc721TokenId, 10);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "address", "uint256", "uint256" ],
            [ contractAddress, destination, erc721.address, tokenId, nonce ]
          )
        );
        const messageToSign = await testContract.methods["generateMessageToSign(address,address,uint256,uint256)"](accounts[4], erc721.address, erc721TokenId, nonce);

        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("raises an error when using the contract address as a destination in the message to sign", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        await testContract.generateMessageToSign(testContract.address, deposit, tokenAddressEther, nonce);

        assert.fail("expected error");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Destination cannot be this contract.")));
      }
    });

    it("emits a 'Funded' event when accepting funds", async () => {
      try {
        const result = await testContract.sendTransaction({
          from: accounts[0],
          to: testContract.address,
          value: deposit
        });
        assert.strictEqual(result.logs[0].event, "Funded");
        assert.strictEqual(result.logs[0].args._newBalance.toString(), deposit.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });
  });

  contract("When first created: generating message: 2of3", async () => {
    let testContract;
    let erc20;
    let erc223;
    let erc721;
    let erc721TokenId;

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize([accounts[0], accounts[1], accounts[2]], 2);
        erc20 = await TestERC20.new();
        erc223 = await TestERC223.new();
        erc721 = await TestERC721.new("test", "tst");
        erc721TokenId = 1;
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("returns the expected message to sign for ether", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const value = deposit;
        const destination = new BN(accounts[4].slice(2), 16);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "uint256", "address", "uint256" ],
            [ contractAddress, destination, value, tokenAddressEther, nonce ]
          )
        );
        const messageToSign = await testContract.generateMessageToSign(accounts[4], deposit, tokenAddressEther, nonce);
        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("returns the expected message to sign for erc20", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const value = deposit;
        const destination = new BN(accounts[4].slice(2), 16);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "uint256", "address", "uint256" ],
            [ contractAddress, destination, value, erc20.address, nonce ]
          )
        );
        const messageToSign = await testContract.generateMessageToSign(accounts[4], deposit, erc20.address, nonce);
        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error in constructor: " + e.message);
      }
    });

    it("returns the expected message to sign for erc223", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const value = deposit;
        const destination = new BN(accounts[4].slice(2), 16);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "uint256", "address", "uint256" ],
            [ contractAddress, destination, value, erc223.address, nonce ]
          )
        );
        const messageToSign = await testContract.generateMessageToSign(accounts[4], deposit, erc223.address, nonce);
        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("returns the expected message to sign for erc721", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const destination = new BN(accounts[4].slice(2), 16);
        const tokenId = new BN(erc721TokenId, 10);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "address", "uint256", "uint256" ],
            [ contractAddress, destination, erc721.address, tokenId, nonce ]
          )
        );
        const messageToSign = await testContract.methods["generateMessageToSign(address,address,uint256,uint256)"](accounts[4], erc721.address, erc721TokenId, nonce);
        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("raises an error when using the contract address as a destination in the message to sign", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        await testContract.generateMessageToSign(testContract.address, deposit, tokenAddressEther, nonce);
        assert.fail("expected error");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Destination cannot be this contract.")));
      }
    });

    it("raises an error when using the contract address as a destination in the message to sign for erc721", async () => {
      try {
        const nonce = await testContract.spendNonce.call()
        await testContract.methods["generateMessageToSign(address,address,uint256,uint256)"](testContract.address, erc721.address, erc721TokenId, nonce);
        assert.fail("expected error");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Destination cannot be this contract.")));
      }
    });

    it("emits a 'Funded' event when accepting funds", async () => {
      try {
        const result = await testContract.sendTransaction({
          from: accounts[0],
          to: testContract.address,
          value: deposit
        });
        assert.strictEqual(result.logs[0].event, "Funded");
        assert.strictEqual(result.logs[0].args._newBalance.toString(), deposit.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });
  });

  contract("When first created: generating message: 10of10", async () => {
    let testContract;
    let erc20;
    let erc223;
    let erc721;
    let erc721TokenId;

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize(accounts.slice(0, 10), 10);
        erc20 = await TestERC20.new();
        erc223 = await TestERC223.new();
        erc721 = await TestERC721.new("test", "tst");
        erc721TokenId = 1;
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("returns the expected message to sign for ether", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const value = deposit;
        const destination = new BN(accounts[4].slice(2), 16);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "uint256", "address", "uint256" ],
            [ contractAddress, destination, value, tokenAddressEther, nonce ]
          )
        );
        const messageToSign = await testContract.generateMessageToSign(accounts[4], deposit, tokenAddressEther, nonce);
        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("returns the expected message to sign for erc20", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const value = deposit;
        const destination = new BN(accounts[4].slice(2), 16);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "uint256", "address", "uint256" ],
            [ contractAddress, destination, value, erc20.address, nonce ]
          )
        );
        const messageToSign = await testContract.generateMessageToSign(accounts[4], deposit, erc20.address, nonce);
        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error in constructor: " + e.message);
      }
    });

    it("returns the expected message to sign for erc223", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const value = deposit;
        const destination = new BN(accounts[4].slice(2), 16);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "uint256", "address", "uint256" ],
            [ contractAddress, destination, value, erc223.address, nonce ]
          )
        );
        const messageToSign = await testContract.generateMessageToSign(accounts[4], deposit, erc223.address, nonce);
        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("returns the expected message to sign for erc721", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const destination = new BN(accounts[4].slice(2), 16);
        const tokenId = new BN(erc721TokenId, 10);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "address", "uint256", "uint256" ],
            [ contractAddress, destination, erc721.address, tokenId, nonce ]
          )
        );
        const messageToSign = await testContract.methods["generateMessageToSign(address,address,uint256,uint256)"](accounts[4], erc721.address, erc721TokenId, nonce);

        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("raises an error when using the contract address as a destination in the message to sign", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        await testContract.generateMessageToSign(testContract.address, deposit, tokenAddressEther, nonce);

        assert.fail("expected error");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Destination cannot be this contract.")));
      }
    });

    it("emits a 'Funded' event when accepting funds", async () => {
      try {
        const result = await testContract.sendTransaction({
          from: accounts[0],
          to: testContract.address,
          value: deposit
        });
        assert.strictEqual(result.logs[0].event, "Funded");
        assert.strictEqual(result.logs[0].args._newBalance.toString(), deposit.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });
  });

  contract("When already funded: accepting funds: 2of2", async () => {
    let testContract;
    let erc20;
    let erc223;
    let erc721;
    let erc721TokenId1;
    let erc721TokenId2;

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize([accounts[0], accounts[1]], 2);
        erc20 = await TestERC20.new();
        await erc20.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc223 = await TestERC223.new();
        await erc223.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc721 = await TestERC721.new("test", "tst");
        erc721TokenId1 = 1;
        erc721TokenId2 = 2;
        await erc721.mint(accounts[0], erc721TokenId1);
        await erc721.mint(testContract.address, erc721TokenId2);
        await makeDepositInEther(accounts[0], testContract.address);
        await makeDepositInErc20(accounts[0], erc20, testContract.address);
        await makeDepositInErc223(accounts[0], erc223, testContract.address);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in ether", async () => {
      try {
        const before = await web3.eth.getBalance(testContract.address);
        await makeDepositInEther(accounts[0], testContract.address);
        const after = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(before.toString(), deposit.toString());
        assert.strictEqual(after.toString(), (deposit * 2).toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc20", async () => {
      try {
        const before = await erc20.balanceOf(testContract.address);
        await makeDepositInErc20(accounts[0], erc20, testContract.address);
        const after = await erc20.balanceOf(testContract.address);
        assert.strictEqual(before.toString(), deposit.toString());
        assert.strictEqual(after.toString(), (deposit * 2).toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc223", async () => {
      try {
        const before = await erc223.balanceOf.call(testContract.address);
        await makeDepositInErc223(accounts[0], erc223, testContract.address);
        const after = await erc223.balanceOf.call(testContract.address);
        assert.strictEqual(before.toString(), deposit.toString());
        assert.strictEqual(after.toString(), (deposit * 2).toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc721", async () => {
      try {
        const beforeOwner = await erc721.ownerOf.call(erc721TokenId1);
        const beforeBalance = (await erc721.balanceOf.call(testContract.address)).toString();
        assert.strictEqual(beforeOwner, accounts[0]);
        assert.strictEqual(beforeBalance, "1");

        await makeDepositInErc721(accounts[0], erc721, testContract.address, erc721TokenId1);

        const afterOwner= await erc721.ownerOf.call(erc721TokenId1);
        const afterBalance = (await erc721.balanceOf.call(testContract.address)).toString();
        assert.strictEqual(afterOwner, testContract.address);
        assert.strictEqual(afterBalance, "2");
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("emits a 'Funded' event when accepting funds", async () => {
      try {
        const result = await testContract.sendTransaction({
          from: accounts[0],
          to: testContract.address,
          value: deposit
        });
        assert.strictEqual(result.logs[0].event, "Funded");
        assert.strictEqual(result.logs[0].args._newBalance.toString(), (deposit * 2).toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });
  });

  contract("When already funded: accepting funds: 3of2", async () => {
    let testContract;
    let erc20;
    let erc223;
    let erc721;
    let erc721TokenId1;
    let erc721TokenId2;

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize([accounts[0], accounts[1], accounts[2]], 2);
        erc20 = await TestERC20.new();
        await erc20.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc223 = await TestERC223.new();
        await erc223.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc721 = await TestERC721.new("test", "tst");
        erc721TokenId1 = 1;
        erc721TokenId2 = 2;
        await erc721.mint(accounts[0], erc721TokenId1);
        await erc721.mint(testContract.address, erc721TokenId2);
        await makeDepositInEther(accounts[0], testContract.address);
        await makeDepositInErc20(accounts[0], erc20, testContract.address);
        await makeDepositInErc223(accounts[0], erc223, testContract.address);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in ether", async () => {
      try {
        const before = await web3.eth.getBalance(testContract.address);
        await makeDepositInEther(accounts[0], testContract.address);
        const after = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(before.toString(), deposit.toString());
        assert.strictEqual(after.toString(), (deposit * 2).toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc20", async () => {
      try {
        const before = await erc20.balanceOf(testContract.address);
        await makeDepositInErc20(accounts[0], erc20, testContract.address);
        const after = await erc20.balanceOf(testContract.address);
        assert.strictEqual(before.toString(), deposit.toString());
        assert.strictEqual(after.toString(), (deposit * 2).toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc223", async () => {
      try {
        const before = await erc223.balanceOf.call(testContract.address);
        await makeDepositInErc223(accounts[0], erc223, testContract.address);
        const after = await erc223.balanceOf.call(testContract.address);
        assert.strictEqual(before.toString(), deposit.toString());
        assert.strictEqual(after.toString(), (deposit * 2).toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc721", async () => {
      try {
        const beforeOwner = await erc721.ownerOf.call(erc721TokenId1);
        const beforeBalance = (await erc721.balanceOf.call(testContract.address)).toString();
        assert.strictEqual(beforeOwner, accounts[0]);
        assert.strictEqual(beforeBalance, "1");

        await makeDepositInErc721(accounts[0], erc721, testContract.address, erc721TokenId1);

        const afterOwner= await erc721.ownerOf.call(erc721TokenId1);
        const afterBalance = (await erc721.balanceOf.call(testContract.address)).toString();
        assert.strictEqual(afterOwner, testContract.address);
        assert.strictEqual(afterBalance, "2");
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("emits a 'Funded' event when accepting funds", async () => {
      try {
        const result = await testContract.sendTransaction({
          from: accounts[0],
          to: testContract.address,
          value: deposit
        });
        assert.strictEqual(result.logs[0].event, "Funded");
        assert.strictEqual(result.logs[0].args._newBalance.toString(), (deposit * 2).toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });
  });

  contract("When already funded: accepting funds: 10of10", async () => {
    let testContract;
    let erc20;
    let erc223;
    let erc721;
    let erc721TokenId1;
    let erc721TokenId2;

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize(accounts.slice(0, 10), 10);
        erc20 = await TestERC20.new();
        await erc20.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc223 = await TestERC223.new();
        await erc223.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc721 = await TestERC721.new("test", "tst");
        erc721TokenId1 = 1;
        erc721TokenId2 = 2;
        await erc721.mint(accounts[0], erc721TokenId1);
        await erc721.mint(testContract.address, erc721TokenId2);
        await makeDepositInEther(accounts[0], testContract.address);
        await makeDepositInErc20(accounts[0], erc20, testContract.address);
        await makeDepositInErc223(accounts[0], erc223, testContract.address);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in ether", async () => {
      try {
        const before = await web3.eth.getBalance(testContract.address);
        await makeDepositInEther(accounts[0], testContract.address);
        const after = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(before.toString(), deposit.toString());
        assert.strictEqual(after.toString(), (deposit * 2).toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc20", async () => {
      try {
        const before = await erc20.balanceOf(testContract.address);
        await makeDepositInErc20(accounts[0], erc20, testContract.address);
        const after = await erc20.balanceOf(testContract.address);
        assert.strictEqual(before.toString(), deposit.toString());
        assert.strictEqual(after.toString(), (deposit * 2).toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc223", async () => {
      try {
        const before = await erc223.balanceOf.call(testContract.address);
        await makeDepositInErc223(accounts[0], erc223, testContract.address);
        const after = await erc223.balanceOf.call(testContract.address);
        assert.strictEqual(before.toString(), deposit.toString());
        assert.strictEqual(after.toString(), (deposit * 2).toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can accept funds in erc721", async () => {
      try {
        const beforeOwner = await erc721.ownerOf.call(erc721TokenId1);
        const beforeBalance = (await erc721.balanceOf.call(testContract.address)).toString();
        assert.strictEqual(beforeOwner, accounts[0]);
        assert.strictEqual(beforeBalance, "1");

        await makeDepositInErc721(accounts[0], erc721, testContract.address, erc721TokenId1);

        const afterOwner= await erc721.ownerOf.call(erc721TokenId1);
        const afterBalance = (await erc721.balanceOf.call(testContract.address)).toString();
        assert.strictEqual(afterOwner, testContract.address);
        assert.strictEqual(afterBalance, "2");
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("emits a 'Funded' event when accepting funds", async () => {
      try {
        const result = await testContract.sendTransaction({
          from: accounts[0],
          to: testContract.address,
          value: deposit
        });
        assert.strictEqual(result.logs[0].event, "Funded");
        assert.strictEqual(result.logs[0].args._newBalance.toString(), (deposit * 2).toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });
  });

  contract("when already funded: spending: 2of2", async () =>  {
    let testContract;
    let erc20;
    let erc721;
    let erc721TokenId;
    let destination;
    let beforeDestinationBalance;
    const signer1 = web3.eth.accounts.privateKeyToAccount(privKeys[0]);
    const signer2 = web3.eth.accounts.privateKeyToAccount(privKeys[1]);
    const nonSigner = web3.eth.accounts.privateKeyToAccount(privKeys[2]);

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize([signer1.address, signer2.address], 2);
        erc20 = await TestERC20.new();
        await erc20.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc721 = await TestERC721.new("test", "tst");
        erc721TokenId = 1;
        await erc721.mint(testContract.address, erc721TokenId);
        await makeDepositInEther(accounts[0], testContract.address);
        await makeDepositInErc20(accounts[0], erc20, testContract.address);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend ether with signed messages from the 1st & 2nd owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;
        const beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const beforeContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);

        const afterContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend ether to forwarder", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const forwarder = await Forwarder.new()
        await forwarder.initialize(destination)
        const value = firstSpend;
        const beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const beforeContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(forwarder.address, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendTransaction(forwarder.address, value, tokenAddressEther, [sig1, sig2], testContract);

        const afterContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend erc20 with signed messages from the 1st & 2nd owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;
        beforeDestinationBalance = new BN(await erc20.balanceOf(destination));
        const beforeContractBalance = new BN(await erc20.balanceOf(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(destination, value, erc20.address, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendTransaction(destination, value, erc20.address, [sig1, sig2], testContract);

        const afterContractBalance = await erc20.balanceOf(testContract.address);
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = await erc20.balanceOf(destination);
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend erc721 with signed messages from the 1st & 2nd owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const beforeTokenOwner = await erc721.ownerOf.call(erc721TokenId);

        const message = await testContract.methods["generateMessageToSign(address,address,uint256,uint256)"](destination, erc721.address, erc721TokenId, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendERC721Transaction(destination, erc721.address, erc721TokenId, [sig1, sig2], testContract);

        const afterTokenOwner = await erc721.ownerOf.call(erc721TokenId);
        assert.strictEqual(beforeTokenOwner, testContract.address);
        assert.strictEqual(afterTokenOwner, destination);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("cannot spend more ether than wallet balance", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        const value = deposit * 2;
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);

        assert.fail("Expected error when trying to spend more ether than wallet balance");
      } catch (e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Insufficient balance to send.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());

        const expectedDestinationBalance = beforeDestinationBalance.add(new BN(0));
        const afterDestinationBalance = await web3.eth.getBalance(destination);
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("cannot spend more erc20 than wallet balance", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        const value = deposit * 2;
        beforeDestinationBalance = new BN(await erc20.balanceOf(destination));

        const message = await testContract.generateMessageToSign(destination, value, erc20.address, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendTransaction(destination, value, erc20.address, [sig1, sig2], testContract);

        assert.fail("Expected error when trying to spend more erc20 than wallet balance");
      } catch (e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("SafeMath: subtraction overflow")));

        const afterContractBalance = new BN(await erc20.balanceOf(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), deposit.toString());

        const expectedDestinationBalance = beforeDestinationBalance.add(new BN(0));
        const afterDestinationBalance = await erc20.balanceOf(destination);
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("cannot spend ether with signed messages from the 1st & 1st owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        const value = firstSpend;
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer1.privateKey)

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);

        assert.fail("Expected error when same signer signed the message");
      } catch (e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signing owners must be different.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());

        const expectedDestinationBalance = beforeDestinationBalance.add(new BN(0));
        const afterDestinationBalance = await web3.eth.getBalance(destination);
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("cannot spend erc20 with signed messages from the 1st & 1st owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        const value = firstSpend;
        beforeDestinationBalance = await erc20.balanceOf(destination);

        const message = await testContract.generateMessageToSign(destination, value, erc20.address, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer1.privateKey)

        await sendMofNSpendTransaction(destination, value, erc20.address, [sig1, sig2], testContract);

        assert.fail("Expected error when same signer signed the message");
      } catch (e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signing owners must be different.")));

        const afterContractBalance = await erc20.balanceOf(testContract.address);
        assert.strictEqual(afterContractBalance.toString(), deposit.toString());

        const expectedDestinationBalance = beforeDestinationBalance.add(new BN(0));
        const afterDestinationBalance = await erc20.balanceOf(destination);
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("cannot spend erc721 with signed messages from the 1st & 1st owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const beforeTokenOwner = await erc721.ownerOf.call(erc721TokenId);

        const message = await testContract.methods["generateMessageToSign(address,address,uint256,uint256)"](destination, erc721.address, erc721TokenId, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer1.privateKey)

        assert.strictEqual(beforeTokenOwner, testContract.address);

        await sendMofNSpendERC721Transaction(destination, erc721.address, erc721TokenId, [sig1, sig2], testContract);

        assert.fail("Expected error when same signer signed the message");
      } catch (e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signing owners must be different.")));

        const afterTokenOwner = await erc721.ownerOf.call(erc721TokenId);
        assert.strictEqual(afterTokenOwner, testContract.address);
      }
    });

    it("emits a 'Spent' event when it is correctly spent", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        const result = await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);

        assert.strictEqual(result.logs[0].event, "Spent");
        assert.strictEqual(result.logs[0].args._destination, destination);
        assert.strictEqual(result.logs[0].args._value.toString(), firstSpend.toString());
        assert.strictEqual(result.logs[0].args._tokenAddress.toLowerCase(), tokenAddressEther);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("throws an error when invalid messages are sent", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        let invalidSig2 = web3.eth.accounts.sign(message, signer2.privateKey)
        //making invalid signature
        invalidSig2.s = invalidSig2.s.replace("a", "b");

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, invalidSig2], testContract);

        assert.fail("Expected error when invalid messages were sent");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());

        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      };
    });

    it("throws an error when invalid number of signatures are given", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        let Vs = [sig1.v, sig2.v];
        let Rs = [sig1.r, sig2.r];
        let Ss = [sig1.s]; // missing sig2.s
        await testContract
          .methods["spend(address,uint256,address,uint8[],bytes32[],bytes32[])"]
          .sendTransaction(
            destination,
            value,
            tokenAddressEther,
            Vs,
            Rs,
            Ss,
          );

        assert.fail("Expected error when invalid number of signatures are given");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Message was not signed by enough number of signers.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());

        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      };
    });

    it("throws an error when message was sent with invalid value", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)
        const invalidValue = 101; //Supposed to be 100

        await sendMofNSpendTransaction(destination, invalidValue, tokenAddressEther, [sig1, sig2], testContract);

        assert.fail("Expected error when message was sent with invalid value"); 
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());
        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("throws an error when correct message signed by wrong account was sent", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, nonSigner.privateKey)

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);

        assert.fail("Expected error when correct message signed by wrong account was sent");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());
        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("throws error when wrong destination was given", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const wrongDestination = accounts[5];
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendTransaction(wrongDestination, value, tokenAddressEther, [sig1, sig2], testContract);

        assert.fail("Expected error when wrong destination was given");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());
        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });
  });

  contract("when already funded: spending: 3of2", async () =>  {
    let testContract;
    let erc20;
    let erc721;
    let erc721TokenId;
    let destination;
    let beforeDestinationBalance;
    const signer1 = web3.eth.accounts.privateKeyToAccount(privKeys[0]);
    const signer2 = web3.eth.accounts.privateKeyToAccount(privKeys[1]);
    const signer3 = web3.eth.accounts.privateKeyToAccount(privKeys[2]);
    const nonSigner = web3.eth.accounts.privateKeyToAccount(privKeys[3]);

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize([signer1.address, signer2.address, signer3.address], 2);
        erc20 = await TestERC20.new();
        await erc20.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc721 = await TestERC721.new("test", "tst");
        erc721TokenId = 1;
        await erc721.mint(testContract.address, erc721TokenId);
        await makeDepositInEther(accounts[0], testContract.address);
        await makeDepositInErc20(accounts[0], erc20, testContract.address);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend ether with signed messages from the 1st & 2nd owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;
        const beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const beforeContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);

        const afterContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend ether with signed messages from the 2nd & 3rd owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;
        const beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const beforeContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer2.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer3.privateKey)

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);

        const afterContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend ether with signed messages from the 1st & 3rd owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;
        const beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const beforeContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer3.privateKey)

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);

        const afterContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend ether to forwarder", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const forwarder = await Forwarder.new()
        await forwarder.initialize(destination)
        const value = firstSpend;
        const beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const beforeContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(forwarder.address, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendTransaction(forwarder.address, value, tokenAddressEther, [sig1, sig2], testContract);

        const afterContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend erc20 with signed messages from the 1st & 2nd owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;
        const beforeDestinationBalance = new BN(await erc20.balanceOf(destination));
        const beforeContractBalance = new BN(await erc20.balanceOf(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(destination, value, erc20.address, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendTransaction(destination, value, erc20.address, [sig1, sig2], testContract);

        const afterContractBalance = new BN(await erc20.balanceOf(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await erc20.balanceOf(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend erc20 with signed messages from the 2nd & 3rd owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;
        const beforeDestinationBalance = new BN(await erc20.balanceOf(destination));
        const beforeContractBalance = new BN(await erc20.balanceOf(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(destination, value, erc20.address, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer2.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer3.privateKey)

        await sendMofNSpendTransaction(destination, value, erc20.address, [sig1, sig2], testContract);

        const afterContractBalance = new BN(await erc20.balanceOf(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await erc20.balanceOf(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend erc20 with signed messages from the 1st & 3rd owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;
        const beforeDestinationBalance = new BN(await erc20.balanceOf(destination));
        const beforeContractBalance = new BN(await erc20.balanceOf(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(destination, value, erc20.address, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer3.privateKey)

        await sendMofNSpendTransaction(destination, value, erc20.address, [sig1, sig2], testContract);

        const afterContractBalance = new BN(await erc20.balanceOf(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await erc20.balanceOf(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend erc721 with signed messages from the 1st & 2nd owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const beforeTokenOwner = await erc721.ownerOf.call(erc721TokenId);

        const message = await testContract.methods["generateMessageToSign(address,address,uint256,uint256)"](destination, erc721.address, erc721TokenId, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendERC721Transaction(destination, erc721.address, erc721TokenId, [sig1, sig2], testContract);

        const afterTokenOwner = await erc721.ownerOf.call(erc721TokenId);
        assert.strictEqual(beforeTokenOwner, testContract.address);
        assert.strictEqual(afterTokenOwner, destination);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend erc721 with signed messages from the 2nd & 3rd owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const beforeTokenOwner = await erc721.ownerOf.call(erc721TokenId);

        const message = await testContract.methods["generateMessageToSign(address,address,uint256,uint256)"](destination, erc721.address, erc721TokenId, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer2.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer3.privateKey)

        await sendMofNSpendERC721Transaction(destination, erc721.address, erc721TokenId, [sig1, sig2], testContract);

        const afterTokenOwner = await erc721.ownerOf.call(erc721TokenId);
        assert.strictEqual(beforeTokenOwner, testContract.address);
        assert.strictEqual(afterTokenOwner, destination);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend erc721 with signed messages from the 1st & 3rd owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const beforeTokenOwner = await erc721.ownerOf.call(erc721TokenId);

        const message = await testContract.methods["generateMessageToSign(address,address,uint256,uint256)"](destination, erc721.address, erc721TokenId, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer3.privateKey)

        await sendMofNSpendERC721Transaction(destination, erc721.address, erc721TokenId, [sig1, sig2], testContract);

        const afterTokenOwner = await erc721.ownerOf.call(erc721TokenId);
        assert.strictEqual(beforeTokenOwner, testContract.address);
        assert.strictEqual(afterTokenOwner, destination);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("emits a 'Spent' event when it is correctly spent", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        const result = await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);

        assert.strictEqual(result.logs[0].event, "Spent");
        assert.strictEqual(result.logs[0].args._destination, destination);
        assert.strictEqual(result.logs[0].args._value.toString(), firstSpend.toString());
        assert.strictEqual(result.logs[0].args._tokenAddress.toLowerCase(), tokenAddressEther);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("throws an error when invalid number of signatures are given", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        let Vs = [sig1.v, sig2.v];
        let Rs = [sig1.r, sig2.r];
        let Ss = [sig1.s]; // missing sig2.s
        await testContract
          .methods["spend(address,uint256,address,uint8[],bytes32[],bytes32[])"]
          .sendTransaction(
            destination,
            value,
            tokenAddressEther,
            Vs,
            Rs,
            Ss,
          );

        assert.fail("Expected error when invalid number of signatures are given");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Message was not signed by enough number of signers.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());

        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      };
    });

    it("throws an error when invalid messages are sent", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        let invalidSig2 = web3.eth.accounts.sign(message, signer2.privateKey)
        //making invalid signature
        invalidSig2.s = invalidSig2.s.replace("a", "b");

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, invalidSig2], testContract);

        assert.fail("Expected error when invalid messages were sent");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());

        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      };
    });

    it("throws an error when message was sent with invalid value", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)
        const invalidValue = 101; //Supposed to be 100

        await sendMofNSpendTransaction(destination, invalidValue, tokenAddressEther, [sig1, sig2], testContract);

        assert.fail("Expected error when message was sent with invalid value"); 
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());
        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("throws an error when correct message signed by wrong account was sent", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, nonSigner.privateKey)

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);

        assert.fail("Expected error when correct message signed by wrong account was sent");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());
        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("throws error when wrong destination was given", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const wrongDestination = accounts[5];
        const sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        const sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendTransaction(wrongDestination, value, tokenAddressEther, [sig1, sig2], testContract);

        assert.fail("Expected error when wrong destination was given");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());
        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });
  });

  contract("when already funded: spending: 10of10", async () =>  {
    let testContract;
    let erc20;
    let erc721;
    let erc721TokenId;
    let destination;
    let beforeDestinationBalance;
    let signers = new Array();
    let signersAddresses = new Array();
    for (let i = 0; i < 10; i++) {
      signers.push(web3.eth.accounts.privateKeyToAccount(privKeys[i]))
      signersAddresses.push(signers[i].address)
    }
    const nonSigner = web3.eth.accounts.privateKeyToAccount(privKeys[10]);

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize(signersAddresses, 10);
        erc20 = await TestERC20.new();
        await erc20.mint(accounts[0], web3.utils.toWei("1", "ether"));
        erc721 = await TestERC721.new("test", "tst");
        erc721TokenId = 1;
        await erc721.mint(testContract.address, erc721TokenId);
        await makeDepositInEther(accounts[0], testContract.address);
        await makeDepositInErc20(accounts[0], erc20, testContract.address);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend ether with signed messages from all the owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;
        const beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const beforeContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[i].privateKey));
        }

        const tx = await sendMofNSpendTransaction(destination, value, tokenAddressEther, sigs, testContract);
        assert.isBelow(tx.receipt.gasUsed, maxGasLimit);

        const afterContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend ether to forwarder", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const forwarder = await Forwarder.new()
        await forwarder.initialize(destination)
        const value = firstSpend;
        const beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const beforeContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(forwarder.address, value, tokenAddressEther, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[i].privateKey));
        }

        const tx = await sendMofNSpendTransaction(forwarder.address, value, tokenAddressEther, sigs, testContract);
        assert.isBelow(tx.receipt.gasUsed, maxGasLimit);

        const afterContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend erc20 with signed messages from all the owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;
        beforeDestinationBalance = new BN(await erc20.balanceOf(destination));
        const beforeContractBalance = new BN(await erc20.balanceOf(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(destination, value, erc20.address, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[i].privateKey));
        }

        const tx = await sendMofNSpendTransaction(destination, value, erc20.address, sigs, testContract);
        assert.isBelow(tx.receipt.gasUsed, maxGasLimit);

        const afterContractBalance = await erc20.balanceOf(testContract.address);
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(firstSpend);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = await erc20.balanceOf(destination);
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can spend erc721 with signed messages from all the owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const beforeTokenOwner = await erc721.ownerOf.call(erc721TokenId);

        const message = await testContract.methods["generateMessageToSign(address,address,uint256,uint256)"](destination, erc721.address, erc721TokenId, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[i].privateKey));
        }

        const tx = await sendMofNSpendERC721Transaction(destination, erc721.address, erc721TokenId, sigs, testContract);
        assert.isBelow(tx.receipt.gasUsed, maxGasLimit);

        const afterTokenOwner = await erc721.ownerOf.call(erc721TokenId);
        assert.strictEqual(beforeTokenOwner, testContract.address);
        assert.strictEqual(afterTokenOwner, destination);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("cannot spend more ether than wallet balance", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        const value = deposit * 2;
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[i].privateKey));
        }

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, sigs, testContract);

        assert.fail("Expected error when trying to spend more ether than wallet balance");
      } catch (e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Insufficient balance to send.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());

        const expectedDestinationBalance = beforeDestinationBalance.add(new BN(0));
        const afterDestinationBalance = await web3.eth.getBalance(destination);
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("cannot spend more erc20 than wallet balance", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        const value = deposit * 2;
        beforeDestinationBalance = new BN(await erc20.balanceOf(destination));

        const message = await testContract.generateMessageToSign(destination, value, erc20.address, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[i].privateKey));
        }

        const tx = await sendMofNSpendTransaction(destination, value, erc20.address, sigs, testContract);
        assert.isBelow(tx.receipt.gasUsed, maxGasLimit);

        assert.fail("Expected error when trying to spend more erc20 than wallet balance");
      } catch (e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("SafeMath: subtraction overflow")));

        const afterContractBalance = new BN(await erc20.balanceOf(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), deposit.toString());

        const expectedDestinationBalance = beforeDestinationBalance.add(new BN(0));
        const afterDestinationBalance = await erc20.balanceOf(destination);
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("cannot spend ether with signed messages from the same owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        const value = firstSpend;
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[1].privateKey));
        }

        const tx = await sendMofNSpendTransaction(destination, value, tokenAddressEther, sigs, testContract);
        assert.isBelow(tx.receipt.gasUsed, maxGasLimit);

        assert.fail("Expected error when same signer signed the message");
      } catch (e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signing owners must be different.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());

        const expectedDestinationBalance = beforeDestinationBalance.add(new BN(0));
        const afterDestinationBalance = await web3.eth.getBalance(destination);
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("cannot spend erc20 with signed messages from the same owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        const value = firstSpend;
        beforeDestinationBalance = await erc20.balanceOf(destination);

        const message = await testContract.generateMessageToSign(destination, value, erc20.address, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[1].privateKey));
        }

        const tx = await sendMofNSpendTransaction(destination, value, erc20.address, sigs, testContract);
        assert.isBelow(tx.receipt.gasUsed, maxGasLimit);

        assert.fail("Expected error when same signer signed the message");
      } catch (e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signing owners must be different.")));

        const afterContractBalance = await erc20.balanceOf(testContract.address);
        assert.strictEqual(afterContractBalance.toString(), deposit.toString());

        const expectedDestinationBalance = beforeDestinationBalance.add(new BN(0));
        const afterDestinationBalance = await erc20.balanceOf(destination);
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("cannot spend erc721 with signed messages from the same owners", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const beforeTokenOwner = await erc721.ownerOf.call(erc721TokenId);

        const message = await testContract.methods["generateMessageToSign(address,address,uint256,uint256)"](destination, erc721.address, erc721TokenId, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[1].privateKey));
        }
        assert.strictEqual(beforeTokenOwner, testContract.address);

        const tx = await sendMofNSpendERC721Transaction(destination, erc721.address, erc721TokenId, sigs, testContract);
        assert.isBelow(tx.receipt.gasUsed, maxGasLimit);

        assert.fail("Expected error when same signer signed the message");
      } catch (e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signing owners must be different.")));

        const afterTokenOwner = await erc721.ownerOf.call(erc721TokenId);
        assert.strictEqual(afterTokenOwner, testContract.address);
      }
    });

    it("emits a 'Spent' event when it is correctly spent", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        const destination = accounts[4];
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[i].privateKey));
        }

        const result = await sendMofNSpendTransaction(destination, value, tokenAddressEther, sigs, testContract);

        assert.isBelow(result.receipt.gasUsed, maxGasLimit);
        assert.strictEqual(result.logs[0].event, "Spent");
        assert.strictEqual(result.logs[0].args._destination, destination);
        assert.strictEqual(result.logs[0].args._value.toString(), firstSpend.toString());
        assert.strictEqual(result.logs[0].args._tokenAddress.toLowerCase(), tokenAddressEther);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("throws an error when invalid messages are sent", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[i].privateKey));
        }
        //making invalid signature
        sigs[1].s = sigs[1].s.replace("a", "b");

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, sigs, testContract);

        assert.fail("Expected error when invalid messages were sent");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());

        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      };
    });

    it("throws an error when invalid number of signatures are given", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[i].privateKey));
        }

        let Vs = new Array();
        let Rs = new Array();
        let Ss = new Array();
        for (let i = 0; i < 10; i++) {
          Vs.push(sigs[i].v);
          Rs.push(sigs[i].r);
        }
        // missing 10th sig.s
        for (let i = 0; i < 9; i++) {
          Ss.push(sigs[i].s);
        }

        await testContract
          .methods["spend(address,uint256,address,uint8[],bytes32[],bytes32[])"]
          .sendTransaction(
            destination,
            value,
            tokenAddressEther,
            Vs,
            Rs,
            Ss,
          );

        assert.fail("Expected error when invalid number of signatures are given");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Message was not signed by enough number of signers.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());

        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      };
    });

    it("throws an error when message was sent with invalid value", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[i].privateKey));
        }
        const invalidValue = 101; //Supposed to be 100

        await sendMofNSpendTransaction(destination, invalidValue, tokenAddressEther, sigs, testContract);

        assert.fail("Expected error when message was sent with invalid value");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());
        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("throws an error when correct message signed by wrong account was sent", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        let sigs = new Array();
        for (let i = 0; i < 9; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[i].privateKey));
        }
        sigs.push(web3.eth.accounts.sign(message, nonSigner.privateKey));

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, sigs, testContract);

        assert.fail("Expected error when correct message signed by wrong account was sent");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());
        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });

    it("throws error when wrong destination was given", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        const wrongDestination = accounts[5];
        let sigs = new Array();
        for (let i = 0; i < 10; i++) {
          sigs.push(web3.eth.accounts.sign(message, signers[i].privateKey));
        }

        await sendMofNSpendTransaction(wrongDestination, value, tokenAddressEther, sigs, testContract);

        assert.fail("Expected error when wrong destination was given");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = await web3.eth.getBalance(testContract.address);
        assert.strictEqual(afterContractBalance, deposit.toString());
        const expectedValueSpent = new BN(0);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      }
    });
  });

  contract("When already spent once", async () => {
    let testContract;
    let erc20;
    let destination;
    let sig1;
    let sig2;
    const signer1 = web3.eth.accounts.privateKeyToAccount(privKeys[0]);
    const signer2 = web3.eth.accounts.privateKeyToAccount(privKeys[1]);

    beforeEach(async () => {
      try {
        testContract = await MultiSigMofN.new();
        await testContract.initialize([signer1.address, signer2.address], 2);
        erc20 = await TestERC20.new();
        await erc20.mint(accounts[0], web3.utils.toWei("1", "ether"));
        await makeDepositInEther(accounts[0], testContract.address);

        const nonce = await testContract.spendNonce.call();
        destination = accounts[4];
        const value = firstSpend;

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("has an incremented spendNonce value", async () => {
      try {
        const nonce = await testContract.spendNonce.call();
        assert.strictEqual(nonce.toString(), "1");
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("returns the expected message to sign", async () => {
      try {
        const value = secondSpend;
        const nonce = await testContract.spendNonce.call();
        const contractAddress = new BN(testContract.address.slice(2), 16);
        const message = web3.utils.keccak256(
          ethabi.solidityPack(
            [ "address",  "address", "uint256", "address", "uint256" ],
            [ contractAddress, destination, value, tokenAddressEther, nonce ]
          )
        );
        const messageToSign = await testContract.generateMessageToSign(destination, secondSpend, tokenAddressEther, nonce);
        assert.strictEqual(message, messageToSign);
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("can be spent by signed messages from the 1st & 2nd owners", async () => {
      try {
        value = secondSpend;
        const nonce = await testContract.spendNonce.call();
        const beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        const beforeContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        const expectedContractBalance = new BN(beforeContractBalance).sub(new BN(value));

        const message = await testContract.generateMessageToSign(destination, value, tokenAddressEther, nonce);
        sig1 = web3.eth.accounts.sign(message, signer1.privateKey)
        sig2 = web3.eth.accounts.sign(message, signer2.privateKey)

        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);

        const afterContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), expectedContractBalance.toString());

        const expectedValueSpent = new BN(value);
        const expectedDestinationBalance = beforeDestinationBalance.add(expectedValueSpent);
        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), expectedDestinationBalance.toString());
      } catch(e) {
        assert.fail("Unexpected error: " + e.message);
      }
    });

    it("cannot be spent by previously used messages signed by the 1st & 2nd owners", async () => {
      try {
        beforeDestinationBalance = new BN(await web3.eth.getBalance(destination));
        beforeContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        await sendMofNSpendTransaction(destination, value, tokenAddressEther, [sig1, sig2], testContract);

        assert.fail("Expected error when previously used message was given");
      } catch(e) {
        console.error(e.message);
        assert.strictEqual(true, e.message.startsWith(vmExceptionTextRevertWithReason("Signer must be the owner.")));

        const afterContractBalance = new BN(await web3.eth.getBalance(testContract.address));
        assert.strictEqual(afterContractBalance.toString(), beforeContractBalance.toString());

        const afterDestinationBalance = new BN(await web3.eth.getBalance(destination));
        assert.strictEqual(afterDestinationBalance.toString(), beforeDestinationBalance.toString());
      }
    });
  });
});
