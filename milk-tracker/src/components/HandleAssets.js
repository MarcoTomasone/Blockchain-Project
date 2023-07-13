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
import { getAccounts, transferCowFromContract, getAllCows, transferMilkFromContract, getCowsOfOwner, killCowFromContract , getDairyInfo, getMilksOfOwner} from '../utils/web3access.mjs';

export default function HandleAssets() {

    const [myAccount, setMyAccount] = useState(null);
    const [cowId, setCowId] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cowList, setCowList] = useState([]);
    const [dairyList, setDairyList] = useState([]);
    const [milkList, setMilkList] = useState([]);
    const [isSendCow, setIsSendCow] = useState(false);
    const [milkId, setMilkId] = useState(null);
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

            getMilksOfOwnerFromContract().then((milkList) => {
                console.log("MILKLIST: " + milkList);
                setMilkList(milkList);
            });

            getDairyList().then((dairyList) => {
                console.log("DAIRYLIST: " + dairyList);
                setDairyList(dairyList);
            });
        }
    }, [myAccount]);
    

    window.ethereum.on('accountsChanged', function (accounts) {
        console.log("ACCOUNTSSSSS: " + accounts);
        setMyAccount(accounts[0]);
    });
  
    const getDairyList = async () => {
        console.log("getDairyList");
        console.log("ACCOUNT TO SEND: " + myAccount);
        const dairyList = await getDairyInfo(myAccount);
        return dairyList;
    };

    const getCowsOfOwnerFromContract = async () => {
        console.log("getCowsOfOwnerFromContract");
        console.log("ACCOUNT TO SEND: " + myAccount);
        const cowList = await getCowsOfOwner(myAccount);
        return cowList;
    };

    const getMilksOfOwnerFromContract = async () => {
        console.log("getMilksOfOwnerFromContract");
        console.log("ACCOUNT TO SEND: " + myAccount);
        const milkList = await getMilksOfOwner(myAccount);
        return milkList;
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
        if (isSendCow) {
            var list = await transferCowFromContract(myAccount, value, cowId);
            console.log("LIST: " + list);
            setDialogOpen(false);
            alert("SUCCESS: Cow sent to: " + value);
            setCowList(list);
        }
        else {
            var list = await transferMilkFromContract(myAccount, value, milkId);
            console.log("LIST: " + list);
            setDialogOpen(false);
            alert("SUCCESS: Milk sent to: " + value);
            setMilkList(list);
        }
    };

    const handleCancel = () => {
        setDialogOpen(false);
    };

    const sendCow = async (cowId) => {
        console.log("sendCow: "+ cowId);
        setCowId(cowId);
        console.log("ACCOUNT TO SEND: " + myAccount);
        setIsSendCow(true);
        handleDialogOpen();
    };    

    const sendMilk = async (milkId) => {
        console.log("sendMilk: "+ milkId);
        setMilkId(milkId);
        console.log("ACCOUNT TO SEND: " + myAccount);
        setIsSendCow(false);
        handleDialogOpen();
    };

    return (
        <div style={{ height: '88vh' }}>
          <AddressSendDialog open={dialogOpen} onClose={handleDialogClose} onCancel={handleCancel} list={dairyList} isSendCow={isSendCow} />
          <h1 style={{ textColor: 'primary' }}>Handle Assets</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '45%' }}>
              <h2>Cows</h2>
              {cowList.length === 0 ? (
                <h3>No cows to show</h3>
              ) : (
                <List
                  key="cowList"
                  sx={{
                    maxHeight: '75%',
                    '& ul': { padding: 0 },
                    overflow: 'auto',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                  }}
                >
                  {[...cowList].sort((a, b) => a.id - b.id).map((cow) => (
                    <div key={'div-list' + cow.id}>
                        <ListItem alignItems="flex-start" key={cow.id}>
                            <div key={'div-icon' + cow.id} style={{ width: '20%' }}>
                                <ListItemAvatar key={'list-item-avatar' + cow.id}>
                                <Icon key={'avatar' + cow.id} width="100%" icon={cowIcon} color="primary" />
                                </ListItemAvatar>
                            </div>
                            <div key={'div-text' + cow.id} style={{ width: '80%' }}>
                            <ListItemText
                                key={'list-item-text' + cow.id}
                                primary={'Cow ID: ' + cow.id}
                                secondary={
                                <React.Fragment key={'fragment' + cow.id}>
                                    <Typography
                                    key={cow.id}
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                    >
                                    {cow.breed + '\n'}
                                    </Typography>
                                    {'Weight: ' + cow.weight + ' kg' + ' | ' + 'Residence: ' + cow.residence}
                                </React.Fragment>
                                }
                            />
                            </div>
                            <div key={'div' + cow.id} style={{ display: 'flex', flexDirection: 'column' }}>
                                <DeleteForeverIcon
                                key={'delete' + cow.id}
                                style={{ color: 'red' }}
                                onClick={() => killUpdateCows(cow.id)}
                                />
                                <SendIcon key={'transfer' + cow.id} color="primary" onClick={() => sendCow(cow.id)} />
                            </div>
                            </ListItem>
                            <Divider key={'divider' + cow.id} variant="inset" component="li" />
                    </div>
                  ))}
                </List>
              )}
            </div>
            <div style={{ width: '45%' }}>
              <h2>Milks</h2>
              {milkList.length === 0 ? (
                <h3>No milks to show</h3>
              ) : (
                <List
                  key="milkList"
                  sx={{
                    maxHeight: '75%',
                    '& ul': { padding: 0 },
                    overflow: 'auto',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                  }}
                >
                  {[...milkList].sort((a, b) => a.id - b.id).map((milk) => (
                    <div key={'div-list' + milk.id}>
                        <ListItem alignItems="flex-start" key={milk.id}>
                            <div key={'div-icon' + milk.id} style={{ width: '30%' }}>
                            <ListItemAvatar key={'list-item-avatar' + milk.id}>
                            <Icon key={'avatar' + milk.id} width="80%" icon="lucide:milk" color="primary" />  
                            </ListItemAvatar>
                            </div>
                        <ListItemText
                            key={'list-item-text' + milk.id}
                            primary={'Milk ID: ' + milk.id}
                            secondary={
                            <React.Fragment key={'fragment' + milk.id}>
                                <Typography
                                key={milk.id}
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                                >
                                {"Date Of Production: " + milk.dateOfProduction }
                                </Typography>
                            </React.Fragment>
                            }
                        />
                        <div key={'div' + milk.id} style={{ display: 'flex', flexDirection: 'column' }}>
                            <SendIcon 
                                key={'transfer' + milk.id} color="primary" 
                                onClick={() => sendMilk(milk.id)} 
                                />
                        </div>
                        </ListItem>
                        <Divider key={'divider' + milk.id} variant="inset" component="li" />
                    </div>
                  ))}
                </List>
              )}
            </div>
          </div>
        </div>
      );            
} 