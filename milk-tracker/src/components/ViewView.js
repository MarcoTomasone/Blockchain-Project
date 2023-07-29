import React, { useEffect, useState } from "react";
import FormDialog from "./FormDialog";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import { getAccounts, loadProductInfoFromContract, loadMilkInfoFromContract, loadCowInfoFromContract, reportSpoiledProduct } from "../utils/web3access.mjs";

export default function ViewView() {
    const [myAccount, setMyAccount] = useState("0x000000000000000");
    const [productId, setProductId] = useState(null);
    const [productData, setProductData] = useState(null);
    const [milkData, setMilkData] = useState(null);
    const [cowData, setCowData] = useState(null);
    const [isMilkSpoiled, setIsMilkSpoiled] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(true); 
    const [isCodeInvalid, setIsCodeInvalid] = useState(false);
    
    useEffect(() => {
        getAccounts().then((accounts) => {
            setMyAccount(accounts[0]);
        });
    }, []); // empty dependency array to run only once

    window.ethereum.on('accountsChanged', function (accounts) {
        setMyAccount(accounts[0]);
    });

    useEffect(() => {
        if (productId !== null) {
            loadProductInfo();
        }
    }, [productId]);

    const handleDialogOpen = () => {
      setDialogOpen(true);
    }

    const handleDialogClose = (value) => {
        setProductId(value);
        setDialogOpen(false);
    };

    const handleCancel = () => {
        setProductId(null);
        setCowData(null);
        setMilkData(null);
        setProductData(null);
        setIsMilkSpoiled(false);
        setDialogOpen(false);
    }

    const loadProductInfo = async () => {
      try{
            var data = await loadProductInfoFromContract(productId);
            setProductData(data);
            loadMilkInfo(data.milkId);
            setIsCodeInvalid(false);
      } catch {
            setProductId(null);
            setCowData(null);
            setMilkData(null);
            setProductData(null);
            setIsMilkSpoiled(false);
            setIsCodeInvalid(true);
      }
    };
        
    const loadMilkInfo = async (milkId) => {
        var data = await loadMilkInfoFromContract(milkId);
        setIsMilkSpoiled(data.milkState);
        setMilkData(data.milk);
        loadCowInfo(data.milk.cowId);
    };

    const loadCowInfo = async (cowId) => {
        var data = await loadCowInfoFromContract(cowId);
        setCowData(data);
    };

    return (
        <div>
        {isMilkSpoiled ? 
            <Alert variant="filled" severity="warning">
            This is a warning alert — Your product may be spoiled! 
            Be careful before consuming it!
            </Alert> 
            : null
        }

        { isCodeInvalid === true ?
            <Alert variant="filled" severity="error">
            Product code does not exist!
        </Alert> 
        : null
        }

        <div>
            <p>
            <h2 style={{ marginRight: '10px', color: 'black' }}>
                Check here info about your product
                <SearchIcon style={{ marginLeft: '20px' ,  fontSize: '50px', color: "blue"}} onClick={handleDialogOpen} />
            </h2>
            <FormDialog open={dialogOpen} onClose={handleDialogClose} onCancel={handleCancel} />
            </p>
            <p>
            Do you want to report that your product is not suitable for consumption?
            <Button variant="contained" color="primary" style={{ margin: "10px" }} onClick={() => isCodeInvalid || productId==null ? null : reportSpoiledProduct(myAccount, milkData.id)}>
                Report
            </Button>
            </p>
        </div>
        <Grid container spacing={1}>
            {/* Colonna della mucca */}
            <Grid item xs={12} sm={4} style={{ backgroundColor: 'lightsteelblue', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid white', borderRadius: '10px', marginLeft: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ color: 'blue' }}>Cow</h2>
                <div style={{ marginBottom: '30px' }}>
                <TextField
                    id="cowId"
                    label="Cow ID"
                    variant="filled"
                    borderColor="blue"
                    borderRadius={10}
                    focused
                    value={cowData ? cowData.id : ""}
                    style={{ backgroundColor: 'white' }}
                />
                </div>
                <div style={{ marginBottom: '30px' }}>
                <TextField
                    id="cowWeight"
                    label="Cow Weight"
                    variant="filled"
                    borderColor="blue"
                    borderRadius={10}
                    focused
                    value={cowData ? cowData.weight : ""}
                    style={{ backgroundColor: 'white' }}
                />
                </div>
                <div style={{ marginBottom: '30px' }}>
                <TextField
                    id="cowBreed"
                    label="Cow Breed"
                    variant="filled"
                    borderColor="blue"
                    borderRadius={10}
                    focused
                    value={cowData ? cowData.breed : ""}
                    style={{ backgroundColor: 'white' }}
                />
                </div>
                <div style={{ marginBottom: '30px' }}>
                <TextField
                    id="cowBirthDate"
                    label="Cow Birth Date"
                    variant="filled"
                    borderColor="blue"
                    borderRadius={10}
                    focused
                    value={cowData ? cowData.birthDate : ""}
                    style={{ backgroundColor: 'white' }}
                />
                </div>
                <div style={{ marginBottom: '30px' }}>
                <TextField
                    id="cowResidence"
                    label="Cow Residence"
                    variant="filled"
                    borderColor="blue"
                    borderRadius={10}
                    focused
                    value={cowData ? cowData.residence : ""}
                    style={{ backgroundColor: 'white' }}
                />
                </div>
            </div>
            </Grid>
    
            {/* Colonna del latte */}
            <Grid item xs={12} sm={4} style={{ backgroundColor: 'lightcyan', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid white', borderRadius: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ color: 'blue' }}>Milk</h2>
                <div style={{ marginBottom: '30px' }}>
                <TextField
                    id="milkId"
                    label="Milk ID"
                    variant="filled"
                    borderColor="blue"
                    borderRadius={10}
                    focused
                    value={milkData ? milkData.id : ""}
                    style={{ backgroundColor: 'white' }}
                />
                </div>
                <div style={{ marginBottom: '30px' }}>
                <TextField
                    id="dateOfProductionMilk"
                    label="Date of production"
                    variant="filled"
                    borderColor="blue"
                    borderRadius={10}
                    focused
                    value={milkData ? milkData.dateOfProduction : ""}
                    style={{ backgroundColor: 'white' }}
                />
                </div>
            </div>
            </Grid>
    
            {/* Colonna del prodotto */}
            <Grid item xs={12} sm={3.9} style={{ backgroundColor: 'lightblue', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid white', borderRadius: '10px' }}>
            <h2 style={{ color: 'blue' }}>Product</h2>
            <div style={{ marginBottom: '30px' }}>
                <TextField
                id="dateOfProduction"
                label="Date of production"
                variant="filled"
                borderColor="blue"
                borderRadius={10}
                focused
                value={productData ? productData.dateOfProduction : ""}
                style={{ backgroundColor: 'white' }}
                />
            </div>
            <div style={{ marginBottom: '30px' }}>
                <TextField
                id="productsType"
                label="Products type"
                variant="filled"
                borderColor="blue"
                borderRadius={10}
                focused
                value={productData ? productData.productType : ""}
                style={{ backgroundColor: 'white' }}
                />
            </div>
            <div style={{ marginBottom: '30px' }}>
                <TextField
                id="expiryDate"
                label="Expiry date"
                variant="filled"
                borderColor="blue"
                borderRadius={10}
                focused
                value={productData ? productData.expiryDate : ""}
                style={{ backgroundColor: 'white' }}
                />
            </div>
            </Grid>
        </Grid>
        </div>
    );     
}
