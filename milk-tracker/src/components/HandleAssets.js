import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Typography from '@mui/material/Typography';
import { Icon } from '@iconify/react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SendIcon from '@mui/icons-material/Send';
import cowIcon from '@iconify/icons-mdi/cow';
import AddressSendDialog from './AddressSendDialog';
import { getAccounts, transferCowFromContract, getAllCows, getCowsOfOwner, killCowFromContract } from '../utils/web3access.mjs';

export default function HandleAssets() {

    const [myAccount, setMyAccount] = useState(null);
    const [cowList, setCowList] = useState([]);
    const [cowId, setCowId] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
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

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };
  
    const handleDialogClose = async (value) => {
        console.log("NEW ADDRESS: " + value);
        var list = await transferCowFromContract(myAccount, value, cowId);
        console.log("LIST: " + list);
        setDialogOpen(false);
        alert("SUCCESS: Cow sent to: " + value);
        setCowList(list);
    };

    const handleCancel = () => {
        setDialogOpen(false);
    };

    const sendCow = async (cowId) => {
        console.log("sendCow: "+ cowId);
        setCowId(cowId);
        console.log("ACCOUNT TO SEND: " + myAccount);
        handleDialogOpen();
    };    

    return(
        <div style={{height: '88vh'}}>
        <AddressSendDialog open={dialogOpen} onClose={handleDialogClose} onCancel={handleCancel} />
            <h1 style={{textColor: 'primary'}}>Handle Assets</h1>
            { cowList.length === 0 ? <h3>No cows to show</h3> : 
                <List key={'list'} sx={{ width: '100%', 
                    maxHeight: '75%',
                    '& ul': { padding: 0 },
                    overflow: 'auto', 
                    maxWidth: 360, 
                    bgcolor: 'background.paper' }}>
                    
                    {  [...cowList].sort((a, b) => a.id - b.id).map((cow) => (
                        <div key={'div-list' +cow.id}>
                            <ListItem alignItems="flex-start" key={cow.id}>
                                <div key={'div-icon' + cow.id} style={{width: '30%'}}>
                                    <ListItemAvatar key={'list-item-avatar' + cow.id}>
                                        <Icon key={'avatar' + cow.id} width='100%' icon={cowIcon} color='primary'/>
                                    </ListItemAvatar>
                                </div>
                                <ListItemText key={'list-item-text' + cow.id}
                                primary= {"Cow ID: " + cow.id}
                                secondary={
                                <React.Fragment key={'fragment' + cow.id}>
                                    <Typography
                                    key={cow.id}
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
                            <div key={'div' + cow.id} style={{ display: 'flex', flexDirection: 'column' }}>
                                    <DeleteForeverIcon key={'delete' + cow.id} style={{ color: 'red' }} onClick={() => killUpdateCows(cow.id)}/>
                                    <SendIcon  key={'transfer' + cow.id} color='primary' onClick={() => sendCow(cow.id)} />
                                </div>
                            </ListItem>
                            <Divider key={'divider' + cow.id} variant="inset" component="li" />
                        </div>
                    ))};
                </List>}
        </div> 
    );
} 