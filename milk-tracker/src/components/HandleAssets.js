import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Icon } from '@iconify/react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SendIcon from '@mui/icons-material/Send';
import cowIcon from '@iconify/icons-mdi/cow';
import { getAccounts, addCow, getAllCows, getCowsOfOwner, killCowFromContract } from '../utils/web3access.mjs';

export default function HandleAssets() {

    const [myAccount, setMyAccount] = useState(null);
    const [cowList, setCowList] = useState([]);
    const [cowId, setCowId] = useState(null);
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
                console.log("COWLIST: " + cowList);
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

    const killUpdateCows = async (cowId) => {
        console.log("kill&updateCows");
        console.log("ACCOUNT TO SEND: " + myAccount);
        await killCowFromContract(myAccount, cowId);
        const cowList = await getCowsOfOwner(myAccount);
        console.log("COWLIST: " + cowList);
        setCowList(cowList);
    };

    return(
        <div style={{height: '88vh'}}>
            <h1 style={{textColor: 'primary'}}>Handle Assets</h1>
            <List sx={{ width: '100%', 
                maxHeight: '75%',
                '& ul': { padding: 0 },
                overflow: 'auto', 
                maxWidth: 360, 
                bgcolor: 'background.paper' }}>
                
                {cowList.map((cow) => (
                    <>
                        <ListItem alignItems="flex-start" key={cow.id}>
                            <div style={{width: '30%'}}>
                                <ListItemAvatar>
                                    <Icon width='100%' icon={cowIcon} color='primary'/>
                                </ListItemAvatar>
                            </div>
                            <ListItemText
                            primary= {"Cow ID: " + cow.id}
                            secondary={
                            <React.Fragment>
                                <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                                >
                                {cow.breed + "\n"}
                                </Typography>
                                {"Weight: " + cow.weight + " kg" + " | " + "Residence: " + cow.residence} 
                            </React.Fragment>
                            }
                            />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <DeleteForeverIcon style={{ color: 'red' }} onClick={() => killUpdateCows(cow.id)}/>
                                <SendIcon color='primary' />
                            </div>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </>
                ))};
            </List>
        </div>
        
    );
} 