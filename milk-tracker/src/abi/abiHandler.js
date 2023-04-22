
function getContractJSON() {
    return require('./MilkTracker.json');
}

function getContractAddress() {
    return getContractJSON().address;
}

function getContractABI() {
    return getContractJSON().abi;
}

console.log(getContractAddress());