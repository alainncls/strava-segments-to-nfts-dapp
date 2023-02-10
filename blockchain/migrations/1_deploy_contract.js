const StravaSegmentNft = artifacts.require("StravaSegmentNft");

module.exports = async function(deployer) {
  await deployer.deploy(StravaSegmentNft);
};