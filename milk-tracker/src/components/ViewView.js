import React, { useEffect, useState } from "react";
import FormDialog from "./FormDialog";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import { getAccounts, loadProductInfoFromContract, loadMilkInfoFromContract, loadCowInfoFromContract, reportSpoiledProduct } from "../utils/web3access.mjs";
import AlertDialog from "./AlertDialog";

export default function ViewView() {
    const [myAccount, setMyAccount] = useState("0x000000000000000");
    const [productId, setProductId] = useState("");
    const [productData, setProductData] = useState(null);
    const [milkData, setMilkData] = useState(null);
    const [cowData, setCowData] = useState(null);
    const [isMilkSpoiled, setIsMilkSpoiled] = useState(false);
    
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

    useEffect(() => {
        loadProductInfo();
    }, [productId]);

    const handleDialogOpen = () => {
        
    }

    const handleDialogClose = (value) => {
        setProductId(value);
    };

    const loadProductInfo = async () => {
            console.log(productId);
            console.log("loadProductInfo");
            var data = await loadProductInfoFromContract(productId);
            console.log(data);
            setProductData(data);
            loadMilkInfo(data.milkId);
        };
        
        const loadMilkInfo = async (milkId) => {
            console.log("loadMilkInfo");
            console.log(milkId);
            var data = await loadMilkInfoFromContract(milkId);
            setIsMilkSpoiled(data.milkState);
            console.log(data);
            setMilkData(data.milk);
            loadCowInfo(data.milk.cowId);
        };

        const loadCowInfo = async (cowId) => {
            console.log("loadCowInfo");
            console.log(cowId);
            var data = await loadCowInfoFromContract(cowId);
            console.log(data);
            setCowData(data);
        };

        return (
            <div>
                {isMilkSpoiled ? 
                    <Alert variant="filled" severity="warning">
                        This is a warning alert — Your product may be spoiled! 
                        Be Careful before consuming it!
                    </Alert> 
                    : null
                }
                <p>
                <Grid container alignItems="center">
                    <Grid item>
                   <h2 style={{marginRight: '10px'}}>
                        Check here info about your product
                    </h2>
                    </Grid>
                    <Grid item>
                    <SearchIcon onClick={handleDialogOpen} />
                    </Grid>
                </Grid>
                </p>
              <FormDialog onClose={handleDialogClose} />
              <Grid container spacing={2}>
                {/* Colonna della mucca */}
                <Grid item xs={12} sm={4}>
                  <h2>Cow</h2>
                  <div style={{ marginBottom: '30px' }}>
                    <TextField
                      id="cowId"
                      label="Cow ID"
                      variant="filled"
                      borderColor="blue"
                      borderRadius={10}
                      focused
                      value={cowData ? cowData.id : ""}
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
                    />
                  </div>
                </Grid>
        
                {/* Colonna del latte */}
                <Grid item xs={12} sm={4}>
                  <h2>Milk</h2>
                  <div style={{ marginBottom: '30px' }}>
                    <TextField
                      id="milkId"
                      label="Milk ID"
                      variant="filled"
                      borderColor="blue"
                      borderRadius={10}
                      focused
                      value={milkData ? milkData.id : ""}
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
                    />
                  </div>
                </Grid>
        
                {/* Colonna del prodotto */}
                <Grid item xs={12} sm={4}>
                  <h2>Product</h2>
                  <div style={{ marginBottom: '30px' }}>
                    <TextField
                      id="dateOfProduction"
                      label="Date of production"
                      variant="filled"
                      borderColor="blue"
                      borderRadius={10}
                      focused
                      value={productData ? productData.dateOfProduction : ""}
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
                    />
                  </div>
                </Grid>
              </Grid>
            <div>
                <p>Do you want to report that your product is not suitable for consumption?
                <Button variant="contained" color="primary" onClick={() => reportSpoiledProduct(myAccount, milkData.id)}>
                    Report
                </Button>
                </p>
            </div>
            </div>
          );
        }
