import { ethers, network, run } from "hardhat";
import * as stravaSegmentJson from "../artifacts/contracts/StravaSegment.sol/StravaSegment.json";
import { networks } from "../../www/src/config/StravaSegment.json";
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";

interface Config {
  chainId: string;
  abi: any;
  address: string;
}

interface NetworkConfig {
  networks: Config[];
}

async function main() {
  console.log("Deploying StravaSegment...");
  const StravaSegment = await ethers.getContractFactory("StravaSegment");
  const stravaSegment = await StravaSegment.deploy();

  await stravaSegment.deploymentTransaction()?.wait(3);

  const stravaSegmentAddress = await stravaSegment.getAddress();

  await run("verify:verify", {
    address: stravaSegmentAddress,
  });

  console.log(
    `StravaSegment contract successfully deployed and verified at ${stravaSegmentAddress}!`,
  );

  console.log(`Generating config file...`);

  const chainIdHex = await network.provider.send("eth_chainId");
  const chainId = BigInt(chainIdHex).toString();

  if (!stravaSegmentJson.abi) {
    throw new Error("Something went wrong");
  }

  const newConfig: Config = {
    chainId,
    address: stravaSegmentAddress,
    abi: stravaSegmentJson.abi,
  };

  const index = networks.findIndex(
    (network) => network.chainId === newConfig.chainId,
  );

  if (index < 0) {
    networks[networks.length] = newConfig;
  } else {
    networks[index] = newConfig;
  }

  const frontendConfig: NetworkConfig = { networks };

  const data = new Uint8Array(
    Buffer.from(JSON.stringify(frontendConfig, null, 2)),
  );

  writeFile("../www/src/config/StravaSegment.json", data, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  console.log(`Config file generated!`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
