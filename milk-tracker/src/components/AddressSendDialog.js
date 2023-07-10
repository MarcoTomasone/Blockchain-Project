import * as React from 'react';
import { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AddressSendDialog({open, onClose, onCancel}) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };


  const handleClose = () => {
    setInputValue(""); // Resetta il valore di input
    onClose(inputValue);
  };

  const handleCancel = () => {
    setInputValue(""); // Resetta il valore di input
    onCancel();
    };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Send Address</DialogTitle>
        <DialogContent>
          <DialogContentText>
           Write here the address you want to send the cow to.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Address"
            type="text"
            fullWidth
            variant="standard"
            value={inputValue}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}