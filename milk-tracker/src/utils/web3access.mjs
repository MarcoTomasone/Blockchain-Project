import Web3 from "web3";
//import dotenv from 'dotenv';
import { getContractABI, getContractAddress } from '../abi/abiHandler.js';

const web3 = new Web3( Web3.givenProvider || "http://127.0.0.1:7545");

function getWeb3Context() {
    return web3;
}

async function getAccounts() {
    return await getWeb3Context().eth.requestAccounts();
}

async function addDairyToContract(account, data) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    await MilkFactoryContract.methods.addDairy(data.dairyName, data.dairyPlace)
            .send({ from: account, gas:3000000 });
}

async function checkIfDairyExists(account) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return await MilkFactoryContract.methods.checkDairyIsRegistered()
            .call({ from: account, gas:3000000 });
}

async function getDairyInfo(account) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return await MilkFactoryContract.methods.getAllDairyExceptSelf().
            call({ from: account, gas:3000000 });   
}

async function addCow(account, data){
    const web3 = getWeb3Context();
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    await MilkFactoryContract.methods.addCow(data.cowWeight, data.cowBreed, data.cowBirth, data.cowResidence)
            .send({ from: account, gas:3000000 }); 
    return true; 
}

function getAllCows(account){
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkFactoryContract.methods.getAllCows()
            .call({ from: account, gas:3000000});
}

async function transferCowFromContract(account, newAccount, cowId) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    await MilkFactoryContract.methods.transferCow(cowId, newAccount)
            .send({ from: account, gas:3000000 });
    return await MilkFactoryContract.methods.getAliveCowsOfOwner()
                .call({ from: account, gas:3000000});
    
}

async function transferMilkFromContract(account, newAccount, milkId) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    await MilkFactoryContract.methods.transferMilk(milkId, newAccount)
            .send({ from: account, gas:3000000 });
    return await MilkFactoryContract.methods.getMilksOfOwner()
                .call({ from: account, gas:3000000});
}

function getCowsOfOwner(account) {
    try {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkFactoryContract.methods.getAliveCowsOfOwner()
            .call({ from: account, gas:3000000});
    } catch (error) {
        console.log("SONO IN ERRORE");    
    }       
}

async function addMilk(account, data) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    await MilkFactoryContract.methods.addMilk(data.cowId, data.dateOfProduction)
                .send({ from: account, gas:3000000 });
    return true; 
}

function getAllMilk(account) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkFactoryContract.methods.getAllMilk()
                .call({ from: account, gas:3000000});
}

function getMilksOfOwner(account) {
    try {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());  
    return MilkFactoryContract.methods.getMilksOfOwner()
                .call({ from: account, gas:3000000});   
    } catch (error) {
        console.log("SONO IN ERRORE");

    }
}

async function addProduct(account, data) {
    console.log("addProduct");
    console.log(data);
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    const receipt = await MilkFactoryContract.methods.addProduct(data.milkId, data.dateOfProduction, data.productsType, data.expiryDate)
                .send({ from: account, gas:3000000 });
    const events = receipt.events.ProductAdded;
    const productId = events.returnValues.productId;
    return productId; 
    }

function getAllProductsFromContract(account) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkFactoryContract.methods.getAllProducts()
                .call({ from: account, gas:3000000});
}

async function loadProductInfoFromContract(productId) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    try {
        const product = await MilkFactoryContract.methods.getProduct(productId).call();
        return product;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function loadMilkInfoFromContract(milkId) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    try {
        const milk = await MilkFactoryContract.methods.getMilk(milkId).call();
        const milkState = await MilkFactoryContract.methods.isMilkSpoiled(milkId).call();
        return {milk, milkState};
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function loadCowInfoFromContract(cowId) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    try {
        const cow = await MilkFactoryContract.methods.getCow(cowId).call();
        return cow;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function reportSpoiledProduct(account, productId) {
    console.log("I'm reporting for product: " + productId);
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress()); 
    const receipt =  await MilkFactoryContract.methods.reportSpoiledProduct(productId)
        .send( { from: account, gas:3000000 });
    console.log(receipt);
    const events = receipt.events.LogMessage;
    console.log(events);
}

async function killCowFromContract(account, cowId) {
    console.log("I'm killing cow: " + cowId);
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    const receipt = await MilkFactoryContract.methods.killCow(cowId)
        .send( { from: account, gas:3000000 });
}

function insertFakeData(account) {
    console.log("insertFakeData");
    const acc = String(account).slice(0,5);
    console.log(acc);
    addCow(account, {cowWeight: 100, cowBreed: acc + "_Cow0", cowBirth: "2021-01-01", cowResidence: "Milano"});
    addCow(account, {cowWeight: 200, cowBreed: acc + "_Cow1", cowBirth: "2021-01-01", cowResidence: "Manfredonia"});
    addMilk(account, {cowId: 0, dateOfProduction: acc + "Cow0_Milk0"});
    addMilk(account, {cowId: 1, dateOfProduction: acc + "Cow1_Milk1"});
}

export  {getWeb3Context, getAccounts, addCow, addMilk, addProduct, getAllCows, transferCowFromContract,
         addDairyToContract, checkIfDairyExists, getDairyInfo,
         getCowsOfOwner, getAllMilk, getMilksOfOwner, insertFakeData, killCowFromContract,
         transferMilkFromContract,
         getAllProductsFromContract, loadProductInfoFromContract, loadMilkInfoFromContract, loadCowInfoFromContract, reportSpoiledProduct};


