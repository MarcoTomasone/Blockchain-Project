import React, { useState, useEffect } from 'react';
import TextField from  '@mui/material/TextField';
import Button from '@mui/material/Button';
import cow from '../img/cow.png';
import { getAccounts, addCow, getAllCows, getCowsOfOwner} from '../utils/web3access.mjs';

export default function InsertCow() {
  
  
  const [myAccount, setMyAccounts] = useState(null);
  const TextFieldIds = ["cowBreed", "cowBirth", "cowResidence", "cowWeight"];

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

  const sendData = () => {
    const data = {
      cowBreed: document.getElementById("cowBreed").value,
      cowBirth: document.getElementById("cowBirth").value,
      cowResidence: document.getElementById("cowResidence").value,
      cowWeight: document.getElementById("cowWeight").value,
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
      console.log(myAccount);
      addCow(myAccount, data);
    }
    else 
      alert("Please fill all the fields");
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ display: 'inline', flexDirection: 'column', alignItems: 'center', width: '30%', paddingTop: '2vh' }}>
        <h2 style={{ marginBottom: '30px', width: '50%', textAlign: 'center', color: 'blue' }}>Insert data cow</h2>
        <div style={{ marginBottom: '30px', width: '50%' }}>
          <TextField style={{ width: '100%' }} id="cowBreed" label="Cow Breed" variant="filled" borderColor="blue" borderRadius={10} focused />
        </div>
        <div style={{ marginBottom: '30px', width: '50%' }}>
          <TextField style={{ width: '100%' }} id="cowBirth" label="Cow Birth" variant="filled" borderColor="blue" borderRadius={10} focused />
        </div>
        <div style={{ marginBottom: '30px', width: '50%' }}>
          <TextField style={{ width: '100%' }} id="cowResidence" label="Cow Residence" variant="filled" borderColor="blue" borderRadius={10} focused />
        </div>
        <div style={{ marginBottom: '30px', width: '50%' }}>
          <TextField style={{ width: '100%' }} id="cowWeight" label="Cow Weight" variant="filled" borderColor="blue" borderRadius={10} focused />
          <Button onClick={sendData} variant="contained" color="primary" style={{margin : '40px'}}>Send</Button>
        </div>
      </div>
      <div style={{ width: '70%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', backgroundImage: `url(${cow})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'right', opacity: 0.8, zIndex: -1 }}></div>
      </div>
    </div>
  );
}



