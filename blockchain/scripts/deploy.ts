import { ethers, run } from "hardhat";

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
    `StravaSegment successfully deployed and verified at ${stravaSegmentAddress}!`,
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
