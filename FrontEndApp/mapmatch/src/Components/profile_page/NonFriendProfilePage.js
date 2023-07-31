import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import FriendsList from './FriendsList';
import ProfilePicture from './ProfilePicture';
import PopUp from './PopUp';
import { Link } from 'react-router-dom';
import ChangeStatusDialog from './ChangeStatusDialog';
import { useState } from 'react';
import PhotoUploaderPopUp from './PhotoUploaderPopUp';
import ProfilePageHeader from './ProfilePageHeader';

export default function NonFriendProfilePage() {
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
        <div style={{
          padding : "1%"
         
        }}> 
            
          Name  
        </div>
        <div style={{
          padding : "1%"
        }}> 
            
          UserName  
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
          <Button variant="outlined" style={{ borderColor: 'black', color : 'black'}}>Prijavi profil</Button>
          <Button variant="outlined" style={{ borderColor: 'black', color : 'black'}}>Posalji zahtev</Button>

      </Paper>
      
    </Box>
    </>
  );
}