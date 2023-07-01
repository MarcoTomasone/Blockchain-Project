import React, { useState, useEffect } from 'react';
import TextField from  '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getAccounts, addProduct, getAllMilk, getMilksOfOwner, getAllProductsFromContract} from '../utils/web3access.mjs';
import product from '../img/products.jpg';

export default function InsertProduct() {
  const [myAccount, setMyAccounts] = useState(null);
  const [milkList, setMilkList] = useState([]);
  const [milkId, setMilkId] = useState(null);
  const TextFieldIds = ["dateOfProduction", "productsType", "expiryDate"];
  
  //Component Did Mount
  useEffect(() => {
    console.log(myAccount);
    //TODO: why if defult account is account2 it sets account1?
    getAccounts().then((accounts) => {
      setMyAccounts(accounts[0]);
      console.log(accounts[0]);
    });

    window.ethereum.on('accountsChanged', function (accounts) {
      setMyAccounts(accounts[0]);
      console.log(accounts[0]);
    });

  }, []);

  //Component Did Update
  useEffect(() => {
    if (myAccount !== null) {  
      getMilksOfOwnerFromContract().then((milkList) => {
        console.log("milkList")
        console.log(milkList);
        setMilkList(milkList);
      });  
    }
  }, [myAccount]);

  
  const getMilksOfOwnerFromContract = async () => {
    console.log("getMilksOfOwnerFromContract");
    console.log(myAccount);
    const cowList = await getMilksOfOwner(myAccount);
    return cowList;
  };

  const handleChange = (event) => {
    setMilkId(event.target.value);
    console.log(event.target.value);
  };

  const sendData = () => {
    const data = {
      milkId: milkId,
      dateOfProduction: document.getElementById("dateOfProduction").value,
      productsType: document.getElementById("productsType").value,
      expiryDate: document.getElementById("expiryDate").value,
    };
    var allFieldsFilled = true;
    
    TextFieldIds.forEach((id) => {
      if(data[id]=== "") {
        allFieldsFilled = false;
        document.getElementById(id).style.border = "2px solid red";
        document.getElementById(id).style.textColor = "red";
      }
    });
    
    if(allFieldsFilled) {
        TextFieldIds.forEach((id) => {
            document.getElementById(id).value = "";
            document.getElementById(id).style.border = "2px solid blue";
        });
        console.log(data);  
       
        var result = addProduct(myAccount, data);
        if (result) {
            alert("Product added");
        }
        else {
            alert("Error");
        }
    }  
    else 
      alert("Please fill all the fields");
  };

  const containerStyle = {
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    width: '100%',
    height: '100%',
  };

  const productImageStyle = {
    position: 'absolute',
    top: '10%',
    right: 0,
    width: '100%',
    height: '90%',
    backgroundImage: `url(${product})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right',
    opacity: 0.99,
    zIndex: -1,
  };

  const formContainerStyle = {
    position: 'absolute',
    top: '13%',
    right: '40px',
    bottom: '1%',
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2vh',
    backgroundColor: 'white', // Aggiunge uno sfondo di colore rosso
  };


  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
      <h2 style={{ marginBottom: '30px', width: '70%', textAlign: 'center', color: "blue"}}>Insert data products</h2>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Milk</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={milkId}
            label="Milk"
            onChange={handleChange}
          >
            {milkList.map((milk) => (
              <MenuItem key={milk.id} value={milk.id}>
                MilkID: {milk.id} CowID: {milk.cowId} Date Of Production: {milk.dateOfProduction} 
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField id="dateOfProduction" label="Date of production"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField id="productsType" label="Products type"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField id="expiryDate" label="Expiry date"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <Button onClick={sendData} variant="contained" color="primary">Send</Button>
      </div>
      <div style={productImageStyle}></div>
    </div>
  );
}