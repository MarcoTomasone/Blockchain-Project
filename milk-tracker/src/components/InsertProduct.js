import React, { useState, useEffect } from 'react';
import TextField from  '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import cow from '../img/products.jpg';
import { getAccounts, addProduct, getAllMilk, getMilksOfOwner} from '../utils/web3access.mjs';

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
      addProduct(myAccount, data);
    }
    else 
      alert("Please fill all the fields");
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', paddingTop: '2vh', marginLeft: '-300px', overflow:'hidden'}}>
      <h2 style={{ marginBottom: '30px', width: '50%', textAlign: 'center', color: "blue", marginLeft: "-475px" }}>Insert data products</h2>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Cow</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={milkId}
            label="Milk"
            onChange={handleChange}
          >
            {milkList.map((milk) => (
              <MenuItem key={milk.id} value={milk.id}>
                ID: {milk.id} CowID: {milk.cowId} Residence: {milk.dateOfProduction} 
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
      <Button onClick={sendData} variant="contained" color="primary" style={{marginLeft: "-475px"}}>Send</Button>
      <div style={{ position: 'absolute', top: 70, left: 0, width: '100vw', height: '86vh', backgroundImage: `url(${cow})`, backgroundSize: '78% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'left center',  opacity: '0.8', zIndex: '-1', marginLeft: "300px"}}></div>
    </div>
  );
}