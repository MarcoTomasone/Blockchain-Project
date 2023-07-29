import * as React from 'react';
import {useState} from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import dairy from '../img/dairy.jpg';
import client from '../img/client.jpg';
import AlertDialog from './AlertDialog';
import { checkIfDairyExists } from '../utils/web3access.mjs';

const images = [
    {
    imageUrl: dairy,
    title: 'Dairy',
    width: '50%',
    toUrl: '/insert',
    },
    {
    imageUrl: client,
    title: 'Client',
    width: '50%',
    toUrl: '/view', //TODO: Change to view section for clients
    },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: '91vh',
    [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 600,
    },
    '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
        opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
        opacity: 0,
    },
    '& .MuiTypography-root': {
        border: '4px solid currentColor',
    },
    },
}));

const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
}));


function LoginView() {
    // Enable/Disable console debug.
    const isConsoleActive = false;
    // Variable to navigate to another page.
    const navigator = useNavigate();
  
    // Function to connect to MetaMask.
    async function login(toUrl) {
        if (isConsoleActive) console.log("Verifica presenza di MetaMask");
        // Check if MetaMask is installed.
        if (typeof window.ethereum === 'undefined') {
            alert("Metamask not installed");
        }
        // Try to connect to MetaMask.
        if (isConsoleActive) console.log("Tentativo di accesso a MetaMask");
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(async () => {
                //Ricevi account
                const account = window.ethereum.selectedAddress;
                var dairyExist = await checkIfDairyExists(account);
                if(toUrl === '/insert' && dairyExist) {
                    // If the connection is successful, navigate to the homepage
                    navigator(toUrl); }
                else if(toUrl === '/view')
                    navigator(toUrl);
                else {
                    navigator('/AddDairy');
                }
            })
            .catch(() => {
                alert("Error during the connection to Metamask. Try later.");
            });
    }


    return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, width: '100%' }}>
        {images.map((image) => (
        <ImageButton
            focusRipple
            key={image.title}
            style={{
            width: image.width,
            }}
            onClick = {() => login(image.toUrl)}
        >
            <ImageSrc style={{ backgroundImage: `url(${image.imageUrl})` }} />
            <ImageBackdrop className="MuiImageBackdrop-root" />
            <Image >
            <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                sx={{
                position: 'relative',
                p: 4,
                pt: 2,
                pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                }}
            >
                {image.title}
                <ImageMarked className="MuiImageMarked-root" />
            </Typography>
            </Image>
        </ImageButton>
        ))}
    </Box>
    );
}

export default LoginView;