import React, { useState, useEffect } from 'react';
import TextField from  '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getAccounts, addProduct, getAllMilk, getMilksOfOwner, getAllProductsFromContract, insertFakeData} from '../utils/web3access.mjs';
import product from '../img/products.jpg';
import QRCode from 'qrcode.react';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';

export default function InsertProduct() {
    const [myAccount, setMyAccount] = useState(null);
    const [milkList, setMilkList] = useState([]);
    const [milkId, setMilkId] = useState(null);
    const [qrCodeText, setQrCodeText] = useState(null);
    const [dateOfProduction, setDateOfProduction] = React.useState(dayjs());
    const [expiryDate, setExpiryDate] = React.useState(dayjs());
    const TextFieldIds = ["dateOfProduction", "productsType", "expiryDate"];
  
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
            if (myAccount !== null) {  
                getMilksOfOwnerFromContract().then((milkList) => {
                console.log("milkList")
                console.log(milkList);
                setMilkList(milkList);
                });
            }   
        }, [myAccount]);

        window.ethereum.on('accountsChanged', function (accounts) {
            console.log("ACCOUNTSSSSS: " + accounts);
            setMyAccount(accounts[0]);
        });

    
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

    const sendData = async () => {
        const data = {
        milkId: milkId,
        dateOfProduction: document.getElementById("dateOfProduction").value,
        productsType: document.getElementById("productsType").value,
        expiryDate: document.getElementById("expiryDate").value,
        };
        var allFieldsFilled = true;
        
        if(milkId == null) {
            document.getElementById("demo-simple-select").style.border = "2px solid red";
            allFieldsFilled = false;
        } else {
            TextFieldIds.forEach((id) => {
                if(data[id]=== "") {
                    allFieldsFilled = false;
                    document.getElementById(id).style.border = "2px solid red";
                    document.getElementById(id).style.textColor = "red";
                }
            });
        }
        
        if(allFieldsFilled) {
            TextFieldIds.forEach((id) => {
                document.getElementById(id).value = "";
                document.getElementById(id).style.border = "2px solid blue";
            });
            console.log(data);  
            setMilkId(null);
            document.getElementById("demo-simple-select").style.border = "2px solid blue";
            var productId = await addProduct(myAccount, data);
            console.log("productId: " + productId);
            setQrCodeText(productId);
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
        right: 0,
        width: '100%',
        height: '91vh',
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

    const qrCodeContainer = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '140px',
        width: '140px',
        border: '3px solid blue',
        margin: '10px',
        padding: '15px',
    };
    

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={containerStyle}>
        <div style={formContainerStyle}>
                <h2 style={{ marginBottom: '30px', width: '70%', textAlign: 'center', color: "blue"}}>Insert data products</h2>
                <div id="qrcode" style={qrCodeContainer}>
                    {qrCodeText != null ? (
                        <QRCode value={qrCodeText.toString()} />
                    ) : null}
                </div>
                {qrCodeText != null ? (
                        <p style={{marginTop: '-5px'}}> Hai inserito il prodotto: {qrCodeText.toString()} </p>
                    ) : null}
                    <FormControl style={{width: '48%'}}>
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
                    <DateField
                        id="dateOfProduction"
                        label="Date Of Production"
                        value={dateOfProduction}
                        onChange={(newValue) => setDateOfProduction(newValue)}
                        format="LL"
                        style={{ width: '48%',  marginTop: '10px' }}
                        variant='filled'
                        bordercolor="blue" borderradius={10} focused
                    />
                    <TextField id="productsType" label="Products type"  variant="filled" style={{ marginTop: '10px' }}  borderColor="blue" borderRadius={10} focused />
                    <DateField
                        id="expiryDate"
                        label="Expiry date"
                        value={expiryDate}
                        onChange={(newValue) => setExpiryDate(newValue)}
                        format="LL"
                        style={{ width: '48%', marginTop: '10px' }}
                        variant='filled'
                        bordercolor="blue" borderradius={10} focused
                    />
                <Button onClick={sendData} style={{ marginTop: '10px' }} variant="contained" color="primary">Send</Button>
        </div>
        <div style={productImageStyle}/>
        </div>
        </LocalizationProvider>
    );
}