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
    const [dialogOpen, setDialogOpen] = useState(true); 
    const [isCodeInvalid, setIsCodeInvalid] = useState(false);
    const [isCode, setIsCode] = useState(false);
    
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
      setDialogOpen(true);
    }

    const handleDialogClose = (value) => {
        setProductId(value);
        setDialogOpen(false);
    };

    const loadProductInfo = async () => {
      try{
            console.log(productId);
            console.log("loadProductInfo");
            var data = await loadProductInfoFromContract(productId);
            console.log(data);
            setProductData(data);
            loadMilkInfo(data.milkId);
            setIsCodeInvalid(false);
      } catch {
            setIsCodeInvalid(true);
      }
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
                Be careful before consuming it!
              </Alert> 
              : null
            }

            {isCodeInvalid ?
              <Alert variant="filled" severity="error">
              Product code does not exist!!!
            </Alert> 
            : null
            }

            <div>
              <p>
                <h2 style={{ marginRight: '10px', color: 'black' }}>
                  Check here info about your product
                  <SearchIcon style={{ marginLeft: '20px' ,  fontSize: '50px', color: "blue"}} onClick={handleDialogOpen} />
                </h2>
                <FormDialog open={dialogOpen} onClose={handleDialogClose} />
              </p>
              <p>
                Do you want to report that your product is not suitable for consumption?
                <Button variant="contained" color="primary" style={{ margin: "10px" }} onClick={() => reportSpoiledProduct(myAccount, milkData.id)}>
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
