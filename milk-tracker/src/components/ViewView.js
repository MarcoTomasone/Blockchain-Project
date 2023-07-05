import React, { useEffect, useState } from "react";
import FormDialog from "./FormDialog";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { getAccounts, loadProductInfoFromContract, loadMilkInfoFromContract, loadCowInfoFromContract, reportSpoiledProduct } from "../utils/web3access.mjs";

export default function ViewView() {
    const [myAccount, setMyAccount] = useState("0x000000000000000");
    const [productId, setProductId] = useState("");
    const [productData, setProductData] = useState(null);
    const [milkData, setMilkData] = useState(null);
    const [cowData, setCowData] = useState(null);
    const [isProductSpoiled, setIsProductSpoiled] = useState(false);
    
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

    const handleDialogClose = (value) => {
        setProductId(value);
    };

    const loadProductInfo = async () => {
            console.log(productId);
            console.log("loadProductInfo");
            var data = await loadProductInfoFromContract(productId);
            console.log(data.productState);
            setIsProductSpoiled(data.productState);
            setProductData(data.product);
            loadMilkInfo(data.milkId);
    };

        const loadMilkInfo = async (milkId) => {
            console.log("loadMilkInfo");
            console.log(milkId);
            var data = await loadMilkInfoFromContract(milkId);
            console.log(data);
            setMilkData(data);
            loadCowInfo(data.cowId);
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
              {isProductSpoiled ? 
                    <Alert variant="filled" severity="warning">
                        This is a warning alert — Your product may be spoiled! 
                    </Alert> : null}
              <FormDialog onClose={handleDialogClose} />
              <h1>{productId}</h1>
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
                <Button variant="contained" color="primary" onClick={() => reportSpoiledProduct(myAccount, productId)}>
                    Yes
                </Button>
                <Button variant="contained" color="secondary" onClick={() => {}}>
                    No
                </Button>
                </p>
            </div>
            </div>
          );
        }
