require("dotenv").config();
const { MNEMONIC, INFURA_API_KEY } = process.env;

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    goerli: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://goerli.infura.io/v3/${INFURA_API_KEY}`
        ),
      network_id: 5,
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
        ),
      network_id: 11155111,
    },
  },
  compilers: {
    solc: {
      version: "0.8.18",
    },
  },
  dashboard: {
    port: 24012,
  },
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
  },
};
