const StravaSegment = artifacts.require("StravaSegment");

module.exports = async function (deployer) {
  await deployer.deploy(StravaSegment);
};
