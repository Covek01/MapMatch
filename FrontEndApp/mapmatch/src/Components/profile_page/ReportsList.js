import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { FixedSizeList } from 'react-window';
import { Avatar, Button, DialogTitle, useMediaQuery, useTheme, ListItemAvatar, ListItemText } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {useState} from 'react';
import RequestService from 'Services/RequestService';
import RequestUtilityFactory from './objects/RequestUtilityFactory';
import axios from 'axios';
import { useEffect } from 'react';
import UserService from 'Services/UserService';

export default function ReportsList({id}) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const [reports, setReports] = useState([]);
    const [reportText, setReportText] = useState('');
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));



    const fetchReports = async () => {
      try {
        const myid = (await UserService.getMyId()).data
        const isAdmin = (await UserService.isAdmin(myid)).data
        if (!isAdmin){
          return
        }
          const { data, status } =
              await RequestService.ReturnReportsToAdmin(id);
          if (status == 200) {
              console.log('uspeo fetch' + id);
              const reports = data.map((request) => ({
                  active: request.active,
                  type: request.type,
                  utility: RequestUtilityFactory.createRequestUlilityByName(request.type),
                  senderUsername: request.senderUsername,
                  receiverUsername: request.receiverUsername,
                  refersToId: request.refersToId,
                  refersToUsername: request.refersToUsername,
                  senderPhoto: request.senderPhoto,
                  sendTime: request.sendTime,
                  message: request.requestMessage
              }));

              setReports(reports);
          }
      } catch (error) {
          if (axios.isAxiosError(error) && error.response.status == 404) {
              console.log(error.response.data)
          }
      }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchReports()
  }, 2000)

  return () => clearInterval(interval)

  }, [])

  useEffect(() => {
      fetchReports()
  }, [])


  const handleClose = () => {
    setOpen(false);
  };
  function handleDetails() {
    setOpen(true);
  };

  async function acceptRequest(index){
    await reports[index].utility.acceptRequest(reports[index]);
    fetchReports();
}

  async function rejectRequest(index){
      await reports[index].utility.rejectRequest(reports[index]);
      fetchReports();
  }
  
  const data = ["IME", "Ime2"];
  function Row(props) {
    const { index, style } = props;

    const secondaryMessageToReportedPerson = `Reportovan :  ${reports[index].refersToUsername}`;
    return (
      <ListItem style={style} key={index} component="div" style={{ height: 80,  maxWidth: 800, maxHeight: 760}} disablePadding>
        <ListItemAvatar>
            <Avatar src={reports[index].senderPhoto}></Avatar>
        </ListItemAvatar>
        <ListItemText primary={reports[index].senderUsername} secondary={secondaryMessageToReportedPerson}>                
        </ListItemText>
        <ListItemText sx={{maxWidth: "40%"}}>{reports[index].message}      
        </ListItemText>
        <Button variant="outlined" sx={{backgroundColor: '#8ea490'}} style={{color: 'black'}} onClick={async (e) => {await acceptRequest(index);}}>Banuj</Button>
        <Button variant="outlined" sx={{backgroundColor: '#dadcda'}} style={{color: 'black'}}onClick={async (e) => {await rejectRequest(index);}}>Odbij</Button>

      </ListItem>
    );
  }
  
  return (
    <Box
      sx={{ width: '100%', height: 400, width: 700, maxWidth: 800, bgcolor: 'background.paper' }}
    >
      <FixedSizeList
        height={200}
        width={500}
        itemSize={46}
        itemCount={reports.length}
        overscanCount={5}
      >
        {Row}
      </FixedSizeList>
    </Box>
  );
}