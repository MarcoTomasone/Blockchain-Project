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
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    await MilkTracker.methods.addDairy(data.dairyName, data.dairyPlace)
            .send({ from: account, gas:3000000 });
}

async function checkIfDairyExists(account) {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    return await MilkTracker.methods.checkDairyIsRegistered()
            .call({ from: account, gas:3000000 });
}

async function getDairyInfo(account) {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    return await MilkTracker.methods.getAllDairyExceptSelf().
            call({ from: account, gas:3000000 });   
}

async function addCow(account, data){
    const web3 = getWeb3Context();
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    await MilkTracker.methods.addCow(data.cowWeight, data.cowBreed, data.cowBirth, data.cowResidence)
            .send({ from: account, gas:3000000 }); 
    return true; 
}

function getAllCows(account){
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkTracker.methods.getAllCows()
            .call({ from: account, gas:3000000});
}

async function transferCowFromContract(account, newAccount, cowId) {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    await MilkTracker.methods.transferCow(cowId, newAccount)
            .send({ from: account, gas:3000000 });
    return await MilkTracker.methods.getAliveCowsOfOwner()
                .call({ from: account, gas:3000000});
    
}

async function transferMilkFromContract(account, newAccount, milkId) {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    await MilkTracker.methods.transferMilk(milkId, newAccount)
            .send({ from: account, gas:3000000 });
    return await MilkTracker.methods.getMilksOfOwner()
                .call({ from: account, gas:3000000});
}

function getCowsOfOwner(account) {
    try {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkTracker.methods.getAliveCowsOfOwner()
            .call({ from: account, gas:3000000});
    } catch (error) {
        console.log("SONO IN ERRORE");    
    }       
}

async function addMilk(account, data) {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    await MilkTracker.methods.addMilk(data.cowId, data.dateOfProduction)
                .send({ from: account, gas:3000000 });
    return true; 
}

function getAllMilk(account) {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkTracker.methods.getAllMilk()
                .call({ from: account, gas:3000000});
}

function getMilksOfOwner(account) {
    try {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());  
    return MilkTracker.methods.getMilksOfOwner()
                .call({ from: account, gas:3000000});   
    } catch (error) {
        console.log("ERRORs");

    }
}

async function addProduct(account, data) {
    console.log("addProduct");
    console.log(data);
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    const receipt = await MilkTracker.methods.addProduct(data.milkId, data.dateOfProduction, data.productsType, data.expiryDate)
                .send({ from: account, gas:3000000 });
    const events = receipt.events.ProductAdded;
    const productId = events.returnValues.productId;
    return productId; 
    }

function getAllProductsFromContract(account) {
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkTracker.methods.getAllProducts()
                .call({ from: account, gas:3000000});
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
        return {milk, milkState};
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

async function reportSpoiledProduct(account, productId) {
    console.log("I'm reporting for product: " + productId);
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress()); 
    const receipt =  await MilkTracker.methods.reportSpoiledProduct(productId)
        .send( { from: account, gas:3000000 });
    console.log(receipt);
}

async function killCowFromContract(account, cowId) {
    console.log("I'm killing cow: " + cowId);
    const MilkTracker = new web3.eth.Contract(getContractABI(), getContractAddress());
    const receipt = await MilkTracker.methods.killCow(cowId)
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


