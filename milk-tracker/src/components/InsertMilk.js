import React, { useState, useEffect } from 'react';
import TextField from  '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import cow from '../img/milk.png';
import { getAccounts, addMilk, getAllCows, getCowsOfOwner} from '../utils/web3access.mjs';

export default function InsertMilk() {
  const [myAccount, setMyAccounts] = useState(null);
  const [cowList, setCowList] = useState([]);
  const [cowId, setCowId] = useState(null);
  const TextFieldIds = ["dateOfProduction"];
  
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', paddingTop: '2vh', marginLeft: '-300px', overflow:'hidden'}}>
      <h2 style={{ marginBottom: '30px', width: '50%', textAlign: 'center', color: "blue", marginLeft: "-475px" }}>Insert data milk</h2>
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
      <Button onClick={sendData} variant="contained" color="primary" style={{marginLeft: "-475px"}}>Send</Button>
      <div style={{ position: 'absolute', top: 70, left: 0, width: '100vw', height: '86vh', backgroundImage: `url(${cow})`, backgroundSize: '78% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'left center',  opacity: '0.8', zIndex: '-1', marginLeft: "300px"}}></div>
    </div>
  );
}