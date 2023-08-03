import Web3 from "web3";
import fs from 'fs';

import { getContractABI, getContractAddress } from '../abi/abiHandler.js';

const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
const gasCosts = {};

function getWeb3Context() {
  return web3;
}

async function getAccounts() {
  return await getWeb3Context().eth.requestAccounts();
}

async function addDairyToContract(account, data, number) {
  const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
  const gas = await MilkTracker.methods.addDairy(data.dairyName, data.dairyPlace).estimateGas({ from: account });
  const receipt = await MilkTracker.methods.addDairy(data.dairyName, data.dairyPlace)
    .send({ from: account, gas: 3000000 });

  const currentGasPriceInWei = await web3.eth.getGasPrice();
  const gasCostInWei = gas * currentGasPriceInWei;
  const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
  const gasUsed = receipt.gasUsed.toString();
  if (!gasCosts["addDairy" + number]) {
    gasCosts["addDairy" + number] = [];
  }
  gasCosts["addDairy" + number].push(gasUsed);
  console.log('Transaction Cost (ETH):', gasCostInETH);
}

async function checkIfDairyExists(account, number) {
  const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
  const gas = await MilkTracker.methods.checkDairyIsRegistered().estimateGas({ from: account });
  const result = await MilkTracker.methods.checkDairyIsRegistered().call({ from: account, gas });

  const currentGasPriceInWei = await web3.eth.getGasPrice();
  const gasCostInWei = gas * currentGasPriceInWei;
  const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
  const gasUsed = receipt.gasUsed.toString();
  if (!gasCosts["checkDairy" + number]) {
    gasCosts["checkDairy" + number] = [];
  }
  gasCosts["checkDairy" + number].push(gasUsed);
  console.log('Transaction Cost (ETH):', gasCostInETH);

  return result;
}

async function getDairyInfo(account, number) {
  const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
  const gas = await MilkTracker.methods.getAllDairyExceptSelf().estimateGas({ from: account });
  const result = await MilkTracker.methods.getAllDairyExceptSelf().call({ from: account, gas });

  const currentGasPriceInWei = await web3.eth.getGasPrice();
  const gasCostInWei = gas * currentGasPriceInWei;
  const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
  const gasUsed = receipt.gasUsed.toString();
  if (!gasCosts["getDairy" + number]) {
    gasCosts["getDairy" + number] = [];
  }
  gasCosts["getDairy" + number].push(gasUsed);
  console.log('Transaction Cost (ETH):', gasCostInETH);

  return result;
}

async function addCow(account, data, number) {
  const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
  const gas = await MilkTracker.methods.addCow(data.cowWeight, data.cowBreed, data.cowBirth, data.cowResidence).estimateGas({ from: account });
  const receipt = await MilkTracker.methods.addCow(data.cowWeight, data.cowBreed, data.cowBirth, data.cowResidence)
    .send({ from: account, gas: 3000000 });

  const currentGasPriceInWei = await web3.eth.getGasPrice();
  const gasCostInWei = gas * currentGasPriceInWei;
  const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
  const gasUsed = receipt.gasUsed.toString();
  if (!gasCosts["addCow" + number]) {
    gasCosts["addCow" + number] = [];
  }
  gasCosts["addCow" + number].push(gasCostInETH);
  console.log('Transaction Cost (ETH):', gasCostInETH);

  return true;
}

async function getAllCows(account, number) {
  const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
  const gas = await MilkTracker.methods.getAllCows().estimateGas({ from: account });
  const result = await MilkTracker.methods.getAllCows().call({ from: account, gas });

  const currentGasPriceInWei = await web3.eth.getGasPrice();
  const gasCostInWei = gas * currentGasPriceInWei;
  const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
  const gasUsed = receipt.gasUsed.toString();
  if (!gasCosts["getAllCows" + number]) {
    gasCosts["getAllCows" + number] = [];
  }
  gasCosts["getAllCows" + number].push(gasUsed);
  console.log('Transaction Cost (ETH):', gasCostInETH);

  return result;
}

async function transferCowFromContract(account, newAccount, cowId, number) {
  const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
  const gas = await MilkTracker.methods.transferCow(cowId, newAccount).estimateGas({ from: account });
  const receipt = await MilkTracker.methods.transferCow(cowId, newAccount)
    .send({ from: account, gas: 3000000 });

  const currentGasPriceInWei = await web3.eth.getGasPrice();
  const gasCostInWei = gas * currentGasPriceInWei;
  const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
  const gasUsed = receipt.gasUsed.toString();
  if (!gasCosts["transferCow" + number]) {
    gasCosts["transferCow" + number] = [];
  }
  gasCosts["transferCow" + number].push(gasUsed);
  console.log('Transaction Cost (ETH):', gasCostInETH);

  const result = await MilkTracker.methods.getAliveCowsOfOwner().call({ from: account, gas });
  return result;
}

async function transferMilkFromContract(account, newAccount, milkId, number) {
  const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
  const gas = await MilkTracker.methods.transferMilk(milkId, newAccount).estimateGas({ from: account });
  const receipt = await MilkTracker.methods.transferMilk(milkId, newAccount)
    .send({ from: account, gas: 3000000 });

  const currentGasPriceInWei = await web3.eth.getGasPrice();
  const gasCostInWei = gas * currentGasPriceInWei;
  const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
  const gasUsed = receipt.gasUsed.toString();
  if (!gasCosts["transferMilk" + number]) {
    gasCosts["transferMilk" + number] = [];
  }
  gasCosts["transferMilk" + number].push(gasUsed);
  console.log('Transaction Cost (ETH):', gasCostInETH);

  const result = await MilkTracker.methods.getMilksOfOwner().call({ from: account, gas });
  return result;
}

async function getCowsOfOwner(account, number) {
  try {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    const gas = await MilkTracker.methods.getAliveCowsOfOwner().estimateGas({ from: account });
    const result = await MilkTracker.methods.getAliveCowsOfOwner().call({ from: account, gas });

    const currentGasPriceInWei = await web3.eth.getGasPrice();
    const gasCostInWei = gas * currentGasPriceInWei;
    const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
    const gasUsed = receipt.gasUsed.toString();
    if (!gasCosts["getCowsOwner" + number]) {
      gasCosts["getCowsOwner" + number] = [];
    }
    gasCosts["getCowsOwner" + number].push(gasUsed);
    console.log('Transaction Cost (ETH):', gasCostInETH);
    return result;
  } catch (error) {
    console.log("SONO IN ERRORE");
  }
}

async function addMilk(account, data, number) {
  const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
  const gas = await MilkTracker.methods.addMilk(data.cowId, data.dateOfProduction).estimateGas({ from: account });
  const receipt = await MilkTracker.methods.addMilk(data.cowId, data.dateOfProduction)
    .send({ from: account, gas: 3000000 });

  const currentGasPriceInWei = await web3.eth.getGasPrice();
  const gasCostInWei = gas * currentGasPriceInWei;
  const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
  const gasUsed = receipt.gasUsed.toString();
  if (!gasCosts["addMilk" + number]) {
    gasCosts["addMilk" + number] = [];
  }
  gasCosts["addMilk" + number].push(gasUsed);
  console.log('Transaction Cost (ETH):', gasCostInETH);

  return true;
}

async function getAllMilk(account, number) {
  const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
  const gas = await MilkTracker.methods.getAllMilk().estimateGas({ from: account });
  const result = await MilkTracker.methods.getAllMilk().call({ from: account, gas });

  const currentGasPriceInWei = await web3.eth.getGasPrice();
  const gasCostInWei = gas * currentGasPriceInWei;
  const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
  const gasUsed = receipt.gasUsed.toString();
  if (!gasCosts["getallMilk" + number]) {
    gasCosts["getallMilk" + number] = [];
  }
  gasCosts["getallMilk" + number].push(gasUsed);
  console.log('Transaction Cost (ETH):', gasCostInETH);

  return result;
}

async function getMilksOfOwner(account, number) {
  try {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    const gas = await MilkTracker.methods.getMilksOfOwner().estimateGas({ from: account });
    const result = await MilkTracker.methods.getMilksOfOwner().call({ from: account, gas });

    const currentGasPriceInWei = await web3.eth.getGasPrice();
    const gasCostInWei = gas * currentGasPriceInWei;
    const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
    const gasUsed = receipt.gasUsed.toString();
    if (!gasCosts["getMilksOwner" + number]) {
      gasCosts["getMilksOwner" + number] = [];
    }
    gasCosts["getMilksOwner" + number].push(gasUsed);
    console.log('Transaction Cost (ETH):', gasCostInETH);
    return result;
  } catch (error) {
    console.log("SONO IN ERRORE");
  }
}

async function addProduct(account, data, number) {
    console.log("addProduct");
    console.log(data);
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    const gas = await MilkTracker.methods.addProduct(data.milkId, data.dateOfProduction, data.productsType, data.expiryDate).estimateGas({ from: account });
    const receipt = await MilkTracker.methods.addProduct(data.milkId, data.dateOfProduction, data.productsType, data.expiryDate)
      .send({ from: account, gas: 3000000 });
  
    const currentGasPriceInWei = await web3.eth.getGasPrice();
    const gasCostInWei = gas * currentGasPriceInWei;
    const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
    const gasUsed = receipt.gasUsed.toString();
    if (!gasCosts["addProduct" + number]) {
      gasCosts["addProduct" + number] = [];
    }
    gasCosts["addProduct" + number].push(gasUsed);
    console.log('Transaction Cost (ETH):', gasCostInETH);
  
    const events = receipt.events.ProductAdded;
    const productId = events.returnValues.productId;
    return productId;
  }

  function saveGasCostsToFile() {
    const jsonData = JSON.stringify(gasCosts, null, 2);
    fs.writeFileSync('gasCosts.json', jsonData);
    console.log('Gas costs saved to gasCosts.json');
  }

  async function insertFakeData(accounts) {
    console.log("insertFakeData");
    console.log(accounts);
  
    await Promise.all(accounts.map(async (account) => {
      console.log("insertFakeData");
      const acc = String(account).slice(0, 5);
      console.log(acc);
      console.log("Account" + account);
      for (let i = 0; i < 30; i++) {
        await addCow(account, { cowWeight: 100, cowBreed: acc + "_Cow" + i, cowBirth: "2021-01-01", cowResidence: "Milano" }, i);
      }
  
      for (let i = 0; i < 30; i++) {
        await addMilk(account, { cowId: i, dateOfProduction: acc + "_Cow" + i + "_Milk" + i }, i);
      }
  
      for (let i = 0; i < 30; i++) {
        await addProduct(account, { milkId: i, dateOfProduction: "July 13, 2023", productsType: "Yogurt" + i, expiryDate: "2021-01-01" }, i);
      }
    }));
  
    saveGasCostsToFile();
  }
  
  async function killCowFromContract(account, cowId, number) {
    console.log("I'm killing cow: " + cowId);
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    const receipt = await MilkTracker.methods.killCow(cowId)
      .send({ from: account, gas: 3000000 });
  
    const currentGasPriceInWei = await web3.eth.getGasPrice();
    const gasCostInWei = gas * currentGasPriceInWei;
    const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
    const gasUsed = receipt.gasUsed.toString();
    if (!gasCosts["kill" + number]) {
      gasCosts["kill" + number] = [];
    }
    gasCosts["kill" + number].push(gasUsed);
    console.log('Transaction Cost (ETH):', gasCostInETH);
  
  }
  
  async function getAllProductsFromContract(account, number) {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    const gas = await MilkTracker.methods.getAllProducts().estimateGas({ from: account });
    const result = await MilkTracker.methods.getAllProducts().call({ from: account, gas });
  
    const currentGasPriceInWei = await web3.eth.getGasPrice();
    const gasCostInWei = gas * currentGasPriceInWei;
    const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
    const gasUsed = receipt.gasUsed.toString();
    if (!gasCosts["getAllProducts" + number]) {
      gasCosts["getAllProducts" + number] = [];
    }
    gasCosts["getAllProducts" + number].push(gasUsed);
    console.log('Transaction Cost (ETH):', gasCostInETH);
  
    return result;
  }
  
  async function loadProductInfoFromContract(productId) {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    try {
      const product = await MilkTracker.methods.getProduct(productId).call();
      return product;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async function loadMilkInfoFromContract(milkId) {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    try {
      const milk = await MilkTracker.methods.getMilk(milkId).call();
      const milkState = await MilkTracker.methods.isMilkSpoiled(milkId).call();
      return { milk, milkState };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async function loadCowInfoFromContract(cowId) {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    try {
      const cow = await MilkTracker.methods.getCow(cowId).call();
      return cow;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async function reportSpoiledProduct(account, productId, number) {
    console.log("I'm reporting for product: " + productId);
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    const receipt = await MilkTracker.methods.reportSpoiledProduct(productId)
      .send({ from: account, gas: 3000000 });
  
    const currentGasPriceInWei = await web3.eth.getGasPrice();
    const gasCostInWei = gas * currentGasPriceInWei;
    const gasCostInETH = web3.utils.fromWei(gasCostInWei.toString(), 'ether');
    const gasUsed = receipt.gasUsed.toString();
    if (!gasCosts["report" + number]) {
      gasCosts["report" + number] = [];
    }
    gasCosts["report" + number].push(gasUsed);
    console.log('Transaction Cost (ETH):', gasCostInETH);
  }
  
  function main() {
    console.log("main");
    const accounts = ['0xf4f1DB6d34094743556eA70C7E91e83aFcb01dc7']; // '0x1fD18a3e5237Fd718076575c584628552d750e9e'];
    insertFakeData(accounts);
  }
  
  main();
  
  export {
    getWeb3Context,
    getAccounts,
    addDairyToContract,
    checkIfDairyExists,
    getDairyInfo,
    addCow,
    getAllCows,
    transferCowFromContract,
    addMilk,
    getAllMilk,
    getMilksOfOwner,
    getCowsOfOwner,
    transferMilkFromContract,
    addProduct,
    insertFakeData,
    killCowFromContract,
    getAllProductsFromContract,
    loadProductInfoFromContract,
    loadMilkInfoFromContract,
    loadCowInfoFromContract,
    reportSpoiledProduct,
    main
  };
  

