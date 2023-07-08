import * as React from 'react';
import { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({open, onClose, onCancel}) {
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
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Welcome to Milk Tracker! 
            Here you can check info about the product you have purchased and the cow that produced it.
            To start, please insert the product ID you can read on the label.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Product ID"
            type="text"
            fullWidth
            variant="standard"
            value={inputValue}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}