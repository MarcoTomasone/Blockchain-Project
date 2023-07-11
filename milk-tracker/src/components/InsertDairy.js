import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import dairy from '../img/dairy.jpg'
import { getAccounts, addDairyToContract } from '../utils/web3access.mjs';

export default function InsertDairy() {
    const [myAccount, setMyAccount] = useState("0x000000000000000");
    const TextFieldIds = ["dairyName", "dairyPlace"];
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
            dairyAddress: myAccount,
            dairyName: document.getElementById("dairyName").value,
            dairyPlace: document.getElementById("dairyPlace").value,
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
                await addDairyToContract(myAccount, data);
                TextFieldIds.forEach((id) => {
                  document.getElementById(id).value = "";
                  document.getElementById(id).style.border = "2px solid blue";
                });
                console.log("Transazione confermata su MetaMask");
              } catch (error) {
                console.log("Errore durante l'invio dei dati:", error);
              }
              navigate('/insert');
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
        backgroundColor: 'white', 
    };

    const dairyImageStyle = {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${dairy})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right',
        opacity: 0.99,
        zIndex: -1,
        transform: 'scaleX(-1)',
        WebkitTransform: 'scaleX(-1)',
        MozTransform: 'scaleX(-1)',
        msTransform: 'scaleX(-1)',
        OTransform: 'scaleX(-1)',
        filter: 'flipv',
        opacity: 0.7,
        filter: 'alpha(opacity=30)',
      };
      

  return (
    <div style={containerStyle}>
        <div style={formContainerStyle}>
          <h2 style={{ marginBottom: '30px', width: '50%', textAlign: 'center', color: 'blue' }}>Please register your Dairy:</h2>
          <div style={{ marginBottom: '30px', width: '50%' }}>
            <TextField style={{ width: '100%' }} id="dairyName" label="Dairy Name" variant="filled" bordercolor="blue" borderradius={10} focused />
          </div>
          <div style={{ marginBottom: '30px', width: '50%' }}>
          </div>
          <div style={{ marginBottom: '30px', width: '50%' }}>
            <TextField style={{ width: '100%' }} id="dairyPlace" label="Dairy Place" variant="filled" bordercolor="blue" borderradius={10} focused />
          </div>
            <Button onClick={sendData} variant="contained" color="primary" style={{ margin: '40px', marginLeft: '55px', width: '50%' }}>register</Button>
        </div>
        <div style={dairyImageStyle}></div>
        </div>
  );
}

