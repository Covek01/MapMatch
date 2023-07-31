
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';




export default function InviteCodeDialog({inviteCode}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleSave(){
    setOpen(false);
  }

  return (
    <div>
     
    <Button variant="contained" style={{backgroundColor : '#8ea490', color : 'white'}}onClick={handleClickOpen}>
        Invite Code
    </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle style={{color : '#8ea490'}}id="responsive-dialog-title">
         Invite Code
        </DialogTitle>
        <DialogContent>
        <div style={{
            width : "200",
            height : "200"
        }}>
        
          
          {inviteCode}
        </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus style={{color : '#8ea490', borderColor : '#8ea490'}} onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}