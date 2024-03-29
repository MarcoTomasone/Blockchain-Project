const MilkTracker = artifacts.require("./MilkTracker.sol");

module.exports = function(deployer) {
   deployer.deploy(MilkTracker)
    .then(() => {
        // Write the contract address to a file
        var fs = require('fs');
        const path = require('path');
        var data = {
          address: MilkTracker.address,
          abi: MilkTracker.abi
        };
        var json = JSON.stringify(data);
        fs.writeFileSync(path.resolve(__dirname, '..', '..', 'milk-tracker', 'src', 'abi', 'MilkTracker.json'), json);
    });
};