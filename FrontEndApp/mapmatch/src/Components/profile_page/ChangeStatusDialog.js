
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
import PhotoUploadComponent from './PhotoUploader';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import RequestsList from './RequestsList';
import RequestUtilityFactory from './objects/RequestUtilityFactory';
import UserService from 'Services/UserService';

export default function ChangeStatusDialog({openDialog, setOpenDialog, setReportText, idReported}) {
  //const [idReported, setIdReported] = useState(idReported); 

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [inputText, setInputText] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };


  const handleClose = () => {
    setOpenDialog(false);
  };

  async function handleSave(){
    setReportText(inputText);
    const reportManager = RequestUtilityFactory.createRequestUlilityByName("Report");
    const myid = (await UserService.getMyId()).data;
    await reportManager.sendRequest(myid, idReported, inputText);
    setOpenDialog(false);
  }

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Write report
        </DialogTitle>
        <DialogContent>
        <div>
          <TextField
            id="outlined-multiline-static"
            label="Write report"
            multiline
            rows={4}
            value={inputText}
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