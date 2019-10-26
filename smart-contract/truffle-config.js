require('babel-polyfill')
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.ROPSTEN_MNEMONIC;
const infura_ropsten_endpoint = "https://ropsten.infura.io/v3/" + process.env.INFURA_ACCESS_TOKEN;
const infura_rinkeby_endpoint = "https://rinkeby.infura.io/v3/" + process.env.INFURA_ACCESS_TOKEN;
const DEFAULT_TESTRPC_HOST = "localhost";
const DEFAULT_TESTRPC_PORT = 8545;
const TESTRPC_HOST = (process.env.TESTRPC_HOST || DEFAULT_TESTRPC_HOST);
const TESTRPC_PORT = (process.env.TESTRPC_PORT || DEFAULT_TESTRPC_PORT);

module.exports = {
  plugins: ["truffle-security"],
  compilers: {
    solc: {
      version: "0.5.12",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1000, // Optimize for how many times you intend to run the code
        },
        evmVersion: "constantinople" // Default: "byzantium"
      }
    }
  },
  networks: {
    infura_ropsten: {
      provider: () => new HDWalletProvider(mnemonic, infura_ropsten_endpoint, 0, 5),
      network_id: "3",
    },
    infura_rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, infura_rinkeby_endpoint, 0, 5),
      network_id: "*", // Match any network id
    },
    development: {
      host:       TESTRPC_HOST,
      port:       TESTRPC_PORT,
      network_id: "*", // Match any network id
      gas:        4600000
    },
    test: {
      host:       TESTRPC_HOST,
      port:       9545,
      network_id: "*", // Match any network id
      gas:        4600000
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555,         // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01      // <-- Use this low gas price
    },
  },
  license: "MIT"
};
