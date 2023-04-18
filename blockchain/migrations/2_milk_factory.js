const MilkFactory = artifacts.require("./MilkFactory.sol");

module.exports = function(deployer) {
   deployer.deploy(MilkFactory)
    .then(() => {
        // Write the contract address to a file
        var fs = require('fs');
        const path = require('path');
        var data = {
          address: MilkFactory.address,
          abi: MilkFactory.abi
        };
        var json = JSON.stringify(data);
        fs.writeFileSync(path.resolve(__dirname, '..', '..', 'milk-tracker', 'src', 'abi', 'MilkTracker.json'), json);
    });
};