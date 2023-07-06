import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import cow from '../img/cow1.jpg';
import InputAdornment from '@mui/material/InputAdornment';
import { getAccounts, addCow, getAllCows, getCowsOfOwner, insertFakeData } from '../utils/web3access.mjs';

export default function InsertCow() {
    const [myAccount, setMyAccount] = useState("0x000000000000000");
    const TextFieldIds = ["cowBreed", "cowBirth", "cowResidence", "cowWeight"];
    const navigate = useNavigate()

    useEffect(() => {
        console.log("OPENING LOG: " + myAccount);
        getAccounts().then((accounts) => {
            console.log("GET: " + accounts);
            console.log("ACCOUNT0: " + accounts[0]);
            setMyAccount(accounts[0]);
        });
    }, []); // empty dependency array to run only once

    useEffect(() => {
        console.log("ACCOUNT CHANGED: " + myAccount);  
    }, [myAccount]);

    window.ethereum.on('accountsChanged', function (accounts) {
        console.log("ACCOUNTSSSSS: " + accounts);
        setMyAccount(accounts[0]);
    });

    const sendData = async (event) => {
        event.preventDefault();
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

        //insertFakeData(myAccount);
        
        if (allFieldsFilled) {
            try {
                console.log(data);
                console.log(myAccount);
                await addCow(myAccount, data);
                TextFieldIds.forEach((id) => {
                  document.getElementById(id).value = "";
                  document.getElementById(id).style.border = "2px solid blue";
                });
                console.log("Transazione confermata su MetaMask");
              } catch (error) {
                console.log("Errore durante l'invio dei dati:", error);
              }
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
            <TextField style={{ width: '100%' }} id="cowBreed" label="Cow Breed" variant="filled" bordercolor="blue" borderradius={10} focused />
          </div>
          <div style={{ marginBottom: '30px', width: '50%' }}>
            <TextField style={{ width: '100%' }} id="cowBirth" label="Cow Birth" variant="filled" bordercolor="blue" borderradius={10} focused />
          </div>
          <div style={{ marginBottom: '30px', width: '50%' }}>
            <TextField style={{ width: '100%' }} id="cowResidence" label="Cow Residence" variant="filled" bordercolor="blue" borderradius={10} focused />
          </div>
          <div style={{ marginBottom: '30px', width: '50%' }}>
            <TextField 
                style={{ width: '100%' }} id="cowWeight" 
                type="number"
                InputProps={{
                    startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                    inputProps: {
                    pattern: '[0-9]*', // Esprime la validazione per accettare solo valori numerici
                    },
                }}        
                label="Cow Weight" 
                variant="filled" 
                bordercolor="blue" 
                borderradius={10} 
                focused 
                />
            <Button onClick={sendData} variant="contained" color="primary" style={{ margin: '40px', marginLeft: '55px', width: '50%' }}>Send</Button>
            <Button onClick={() =>  navigate("../milk")} variant="contained" color="primary" style={{marginLeft: '53px' }}>InsertMilk</Button>
          </div>
        </div>
        <div style={cowImageStyle}></div>
        </div>
  );
}

