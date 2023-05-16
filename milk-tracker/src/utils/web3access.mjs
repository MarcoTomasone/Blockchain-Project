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
    return MilkFactoryContract.methods.addCow( data.cowId,  data.cowWeight, data.cowBreed, data.cowBirth, data.cowResidences)
            .send({ from: account });
}

function addMilk(account, data) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkFactoryContract.methods.addMilk(data.milkId, data.cowId, data.dateOfProduction, data.dairyName, data.dairyPlace)
                .send({ from: account });
}

function addProduct(account, data) {
    const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
    return MilkFactoryContract.methods.addProduct(data.productId, data.milkId, data.dateOfProduction, data.productsType, data.expiryDate)
                .send({ from: account });
}

export  {getWeb3Context, getAccounts, addCow, addMilk, addProduct};



/*

//console.log(web3);

web3.eth.getAccounts().then(console.log)

// Ora puoi utilizzare le funzioni importate
const MilkFactoryContract = new web3.eth.Contract(getContractABI(), getContractAddress());
//console.log(MilkFactoryContract);


/*
var myAddress;
web3.eth.getAccounts()
.then((accounts) => {
       myAddress = accounts[0];
    console.log(myAddress);
    MilkFactoryContract.methods.addCow(cowId).send({ from: myAddress }).then((receipt) => {
        // La transazione è stata confermata
        console.log("Ho fatto");
        console.log(receipt);
    })
    .catch((error) => {
        // Si è verificato un errore durante l'esecuzione della transazione
        console.error(error);
        console.log("Non Ho fatto");
    });

  })
  .catch((error) => {
    console.error(error);
  });
*/
