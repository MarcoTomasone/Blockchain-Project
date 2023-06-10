import Web3 from "web3";
//import dotenv from 'dotenv';
import { getContractABI, getContractAddress } from '../abi/abiHandler.js';

//dotenv.config();

//const web3 = new Web3(process.env.CHAIN_URL);
const web3 = new Web3("http://127.0.0.1:7545");

function getWeb3Context() {
    return web3;
}

function getAccounts() {
    return getWeb3Context().eth.getAccounts();
}

function addCow(account, data){
    const web3 = getWeb3Context();
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkFactoryContract.methods.addCow(data.cowWeight, data.cowBreed, data.cowBirth, data.cowResidence)
            .send({ from: account, gas:3000000 });
}

function getAllCows(account){
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkFactoryContract.methods.getAllCows()
            .call({ from: account, gas:3000000});
}

function getCowsOfOwner(account) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkFactoryContract.methods.getCowsOfOwner()
            .call({ from: account, gas:3000000});
}

function addMilk(account, data) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkFactoryContract.methods.addMilk(data.cowId, data.dateOfProduction)
                .send({ from: account, gas:3000000 });
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

function addProduct(account, data) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkFactoryContract.methods.addProduct(data.productId, data.milkId, data.dateOfProduction, data.productsType, data.expiryDate)
                .send({ from: account });
}

export  {getWeb3Context, getAccounts, addCow, addMilk, addProduct, getAllCows, getCowsOfOwner, getAllMilk, getMilksOfOwner};


