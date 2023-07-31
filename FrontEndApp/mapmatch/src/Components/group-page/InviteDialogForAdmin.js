
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


export default function InviteDialogForAdmin({}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [inviteCode, setInviteCode] = useState('1234akshdk');

  const handleInputChange = (event) => {
    setInviteCode(event.target.value);
  };
 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleSave(){
    setInviteCode(inviteCode);
    setOpen(false);
  }

  return (
    <div>
     
    <Button variant="outlined" style={{backfroundColor : '#8ea490', borderColor : '#8ea490'}}onClick={handleClickOpen}>
        Invite code
    </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
            Invite code
        </DialogTitle>
        <DialogContent>
        <div>
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows={4}
            value={inviteCode}
            onChange={handleInputChange}
          />
        </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus style={{color : 'black', borderColor : 'black'}} onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}