import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import cow from '../img/cow1.jpg';
import { getAccounts, addCow, getAllCows, getCowsOfOwner, insertFakeData } from '../utils/web3access.mjs';

export default function InsertCow() {
  const [myAccount, setMyAccount] = useState(null);
  const TextFieldIds = ["cowBreed", "cowBirth", "cowResidence", "cowWeight"];

  // Component Did Mount
  useEffect(() => {
    console.log(myAccount);
    // TODO: why if default account is account2 it sets account1?
    getAccounts().then((accounts) => {
      setMyAccount(accounts[0]);
      console.log(myAccount);
      if(myAccount != null){
        insertFakeData(myAccount);
        console.log("Fake data inserted");
      }
    });

    window.ethereum.on('accountsChanged', function (accounts) {
      setMyAccount(accounts[0]);
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
    let allFieldsFilled = true;

    TextFieldIds.forEach((id) => {
      if (data[id] === "") {
        allFieldsFilled = false;
        document.getElementById(id).style.border = "2px solid red";
        document.getElementById(id).style.color = "red";
      }
    });

    if (allFieldsFilled) {
      TextFieldIds.forEach((id) => {
        document.getElementById(id).value = "";
        document.getElementById(id).style.border = "2px solid blue";
      });
      console.log(data);
      console.log(myAccount);
      addCow(myAccount, data);
    } else {
      alert("Please fill all the fields");
    }
  };

  const containerStyle = {
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    width: '100%',
    height: '100%',
  };

  const formContainerStyle = {
    position: 'absolute',
    top: '16%',
    right: '40px',
    bottom: '40px',
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2vh',
    backgroundColor: 'white', // Aggiunge uno sfondo di colore rosso
  };

  const cowImageStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${cow})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right',
    opacity: 0.99,
    zIndex: -1,
  };

  return (
    <div style={containerStyle}>
        <div style={formContainerStyle}>
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
            <Button onClick={sendData} variant="contained" color="primary" style={{ margin: '40px', width: '50%' }}>Send</Button>
          </div>
        </div>
        <div style={cowImageStyle}></div>
        </div>
  );
}

