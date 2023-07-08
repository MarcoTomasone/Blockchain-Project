import React, { useState, useEffect } from 'react';
import TextField from  '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import milk from '../img/milk1.jpg';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { getAccounts, addMilk, getAllCows, getCowsOfOwner} from '../utils/web3access.mjs';

export default function InsertMilk() {
    const [myAccount, setMyAccount] = useState(null);
    const [cowList, setCowList] = useState([]);
    const [cowId, setCowId] = useState(null);
    const [date, setDate] = React.useState(dayjs());
    const TextFieldIds = ["demo-simple-select", "dateOfProduction"];
    const navigate = useNavigate();
    
    //Component Did Mount
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
            getCowsOfOwnerFromContract().then((cowList) => {
            setCowList(cowList);
            });
        }
    }, [myAccount]);

    window.ethereum.on('accountsChanged', function (accounts) {
        console.log("ACCOUNTSSSSS: " + accounts);
        setMyAccount(accounts[0]);
    });
  
    const getCowsOfOwnerFromContract = async () => {
        console.log("getCowsOfOwnerFromContract");
        console.log("ACCOUNT TO SEND: " + myAccount);
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
        
        if(cowId == null) {
            document.getElementById("demo-simple-select").style.border = "2px solid red";
            allFieldsFilled = false;
        } else {
            if(data.dateOfProduction === "") {
                document.getElementById("dateOfProduction").style.border = "2px solid red";
                allFieldsFilled = false;
            }
        }
            
        if(allFieldsFilled) {
            TextFieldIds.forEach((id) => {
                document.getElementById(id).value = "";
                document.getElementById(id).style.border = "2px solid blue";
            });
            setCowId(null);
            setDate(dayjs());
            var result = addMilk(myAccount, data);
            console.log(data);  
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
        right: 0,
        width: '100%',
        height: '91vh',
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateField
                    id="dateOfProduction"
                    label="dateOfProduction"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    format="LL"
                    style={{ width: '100%' }}
                    variant='filled'
                    bordercolor="blue" borderradius={10} focused
                />
                </LocalizationProvider>
        </div>
        <Button onClick={sendData} variant="contained" color="primary">Send</Button>
        <Button onClick={() =>  navigate("../products")} variant="contained" color="primary" style={{ margin : '10px'}}>InsertProducts</Button>

        </div>
        <div style={milkImageStyle}></div>
        </div>
    );
}