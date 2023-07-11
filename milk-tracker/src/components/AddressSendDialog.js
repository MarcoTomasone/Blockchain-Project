import * as React from 'react';
import { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function AddressSendDialog({open, onClose, onCancel, list}) {
    var [dairyAddress, setDairyAddress] = useState(null);

    const handleClose = () => {
        console.log("Dairy Address: " + dairyAddress);
        onClose(dairyAddress);
    };

    const handleCancel = () => {
        onCancel();
        };

    const handleChangeSelect = (event) => {
        setDairyAddress(event.target.value);
        console.log(event.target.value);
    };

  return (
    <div>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Send To:</DialogTitle>
        <DialogContent>
          <DialogContentText>
           Write here the address you want to send the cow to.
          </DialogContentText>
          { list.length !== 0 ? (
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Dairy</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={dairyAddress}
                label="Dairy"
                onChange={handleChangeSelect}
            >
                {list.map((dairy) => (
                <MenuItem key={dairy.dairyAddress} value={dairy.dairyAddress}>
                    Name: {dairy.dairyName} Place: {dairy.dairyPlace}
                </MenuItem>
                ))}
            </Select>
            </FormControl>)
            : (<div>There are no dairies</div>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}