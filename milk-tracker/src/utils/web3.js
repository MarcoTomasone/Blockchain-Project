const Web3 = require('web3')
require('dotenv').config()


const web3 = new Web3(process.env.CHAIN_URL);
//console.log(web3);
web3.eth.getBalance("0x311D372292e0F053B5aCb3094ceDF6c26182a72a").then(console.log)
//console.log(account);