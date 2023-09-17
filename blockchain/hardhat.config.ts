import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const config: HardhatUserConfig = {
  solidity: "0.8.18",
  defaultNetwork: "linea-goerli",
  networks: {
    hardhat: {},
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY ?? ""}`,
      accounts: [
        process.env.PRIVATE_KEY ??
          "0000000000000000000000000000000000000000000000000000000000000000",
      ],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY ?? ""}`,
      accounts: [
        process.env.PRIVATE_KEY ??
          "0000000000000000000000000000000000000000000000000000000000000000",
      ],
    },
    "linea-goerli": {
      url: `https://linea-goerli.infura.io/v3/${
        process.env.INFURA_API_KEY ?? ""
      }`,
      accounts: [
        process.env.PRIVATE_KEY ??
          "0000000000000000000000000000000000000000000000000000000000000000",
      ],
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY ?? "",
      sepolia: process.env.ETHERSCAN_API_KEY ?? "",
      "linea-goerli": process.env.LINEASCAN_API_KEY ?? "",
    },
    customChains: [
      {
        network: "linea-goerli",
        chainId: 59140,
        urls: {
          apiURL: "https://api-testnet.lineascan.build/api",
          browserURL: "https://goerli.lineascan.build",
        },
      },
    ],
  },
};

export default config;
