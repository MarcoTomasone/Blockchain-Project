import React, { useState, useEffect } from 'react';
import TextField from  '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import milk from '../img/milk1.jpg';
import { getAccounts, addMilk, getAllCows, getCowsOfOwner} from '../utils/web3access.mjs';

export default function InsertMilk() {
  const [myAccount, setMyAccounts] = useState(null);
  const [cowList, setCowList] = useState([]);
  const [cowId, setCowId] = useState(null);
  const TextFieldIds = ["dateOfProduction", "dairyName", "dairyPlace"];
  
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
      getCowsOfOwnerFromContract().then((cowList) => {
        setCowList(cowList);
      });
    }
  }, [myAccount]);

  
  const getCowsOfOwnerFromContract = async () => {
    console.log("getCowsOfOwnerFromContract");
    console.log(myAccount);
    const cowList = await getCowsOfOwner(myAccount);
    return cowList;
  };

  const handleChange = (event) => {
    setCowId(event.target.value);
    console.log(event.target.value);
  };

  const sendData = () => {
    const data = {
      cowId: cowId,
      dateOfProduction: document.getElementById("dateOfProduction").value,
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
      addMilk(myAccount, data);
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

  const milkImageStyle = {
    position: 'absolute',
    top: '10%',
    right: 0,
    width: '100%',
    height: '90%',
    backgroundImage: `url(${milk})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right',
    opacity: 0.9,
    zIndex: -1,
  };

  const formContainerStyle = {
    position: 'absolute',
    top: '25%',
    right: '40px',
    bottom: '15%',
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
      <h2 style={{ marginBottom: '30px', width: '50%', textAlign: 'center', color: "blue"}}>Insert data milk</h2>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Cow</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={cowId}
            label="Cow"
            onChange={handleChange}
          >
            {cowList.map((cow) => (
              <MenuItem key={cow.id} value={cow.id}>
                ID: {cow.id} Weight: {cow.weight} Kg Residence: {cow.residence} Breed: {cow.breed}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField id="dateOfProduction" label="Date of Production"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <Button onClick={sendData} variant="contained" color="primary">Send</Button>
      </div>
      <div style={milkImageStyle}></div>
    </div>
  );
}