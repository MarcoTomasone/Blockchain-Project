var MilkFactory = artifacts.require("./MilkFactory.sol");
module.exports = function(deployer) {
    deployer.deploy(MilkFactory);
};