import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import ProfilePicture from '../profile_page/ProfilePicture';
import PopUp from '../profile_page/PopUp';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import MembersList from './MembersList';
import InviteCodeDialog from './InviteCodeDialog';
import ProfilePageHeader from 'Components/profile_page/ProfilePageHeader';
import PhotoUploaderPopUp from './PhotoUploaderPopUp';
import DropDownFriends from './DropDownFriends';
import ListOfGroups from './ListOfFriends';

export default function Profile() {
  //const [statusText, setStatusText] = useState('');
  const [photo, setPhoto] = useState('');
  const [statusText, setStatusText] = useState('');
  const [savedStatusText, setSavedStatusText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

    function handleCodeForInvite() {
        
    }

  const handleEditStatus = () => {
    setIsEditing(true);
  };

  const handleSaveStatus = () => {
    setSavedStatusText(statusText);
    setIsEditing(false);
  }
  
  const isFriend = true;

  return (
    <>
      <ProfilePageHeader />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '20px',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: '100%',
            maxWidth: 600,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <ProfilePicture photo={photo} />
  
          <Typography variant="h5" sx={{ mt: 2 }}>
            Name
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            UserName
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            {statusText}
          </Typography>
  
          {isEditing ? (
            <input
              type="text"
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              onBlur={() => setIsEditing(false)}
              placeholder="Kucaj..."
              style={{
                border: '1px solid black',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '16px',
              }}
            />
          ) : (
            <div
              onClick={handleEditStatus}
              style={{
                border: '1px solid black',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              {savedStatusText || 'Promeni status'}
            </div>
          )}
  
          <div style={{ padding: '1%' }}>UserName</div>
  
          <div style={{ padding: '1%' }}>Status</div>
  
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
          <PopUp textForTitle={'Friends'}>
            <FriendsList></FriendsList>
          </PopUp>
          <PopUp textForTitle={'Groups'}>
            <FriendsList></FriendsList>
          </PopUp>
          <Button /*component={Link} to="/chat" */ variant="outlined" style={{ borderColor: 'black', color: 'black' }}>
            Posalji poruku
          </Button>
          <Button variant="outlined" style={{ borderColor: 'black', color: 'black' }}>
            Prijavi profil
          </Button>
        </Paper>
      </Box>
    </>
  );



