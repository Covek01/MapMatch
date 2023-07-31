import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import ProfilePicture from '../profile_page/ProfilePicture';
import PopUp from '../profile_page/PopUp';
import { Link } from 'react-router-dom';
import ChangeStatusDialog from '../profile_page/ChangeStatusDialog';
import { useState } from 'react';
import PhotoUploaderPopUp from '../profile_page/PhotoUploaderPopUp';
import MembersList from './MembersList';
import InviteCodeDialog from './InviteCodeDialog';
import InviteDialogForAdmin from './InviteDialogForAdmin';
import ProfilePageHeader from 'Components/profile_page/ProfilePageHeader';

export default function AdminGroupContent() {
  const [statusText, setStatusText] = useState('');
  const  [photo, setPhoto] = useState('');

  return (
    <>
    <ProfilePageHeader />
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center', // Center items horizontally
        alignItems: 'center', // Center items vertically
        '& > :not(style)': {
          m: 1,
          width: '70%',
          height: 'calc(100vh - 105px)',
          backgroundColor : 'white'
        }
      }}
    >
     <Paper elevation={4} 
        style={{background: "white",
                padding: '10px',
                display: 'flex',
                flexDirection : 'column',
                alignItems: 'flex-start'
                
        }} >
        <ProfilePicture photo = {photo}></ProfilePicture>
        <PhotoUploaderPopUp setPhoto={setPhoto}/>
        <div style={{
          padding : "1%"
         
        }}> 
            
          Name  
        </div>
        
        <div style={{
          padding : "1%"
        }}> 
            
          Status  
        </div>
        <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="white"
      border="1px solid black"
      borderRadius="4px"
      p={2}
      maxWidth={420}
      minWidth={200}
      minHeight={100}
      maxHeight={220}
    >
      <Typography variant="body1" color="textPrimary" align="center">
        {statusText} 
      </Typography>
    </Box>
        
        <PopUp textForTitle={"Members"}>
            <MembersList></MembersList>
        </PopUp>
          <Button component={Link} to="/map" variant="outlined" style={{ borderColor: 'black', color : 'black'}}>Idi na mapu</Button>
          <Button /*component={Link} to="/chat" */ variant="outlined" style={{ borderColor: 'black', color : 'black'}}>Otvori chat</Button>
          <InviteDialogForAdmin></InviteDialogForAdmin>
      </Paper>
      
    </Box>
    </>
  );
}