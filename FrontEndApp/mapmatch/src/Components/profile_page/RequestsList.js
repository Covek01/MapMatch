import * as React from 'react'
import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import { FixedSizeList } from 'react-window'
import { Avatar, Button, ListItemText, ListItemAvatar, ListItemButton } from '@mui/material'
import { useEffect } from 'react'
import FriendshipService from 'Services/FriendshipService'
import RequestService from 'Services/RequestService'
import axios from 'axios'
import { useState } from 'react'
import { NotificationsSharp, Restaurant} from '@mui/icons-material'
import RequestUtilityFactory from './objects/RequestUtilityFactory'



export default function VirtualizedList({ id }) {
    const [notifications, setNotifications] = useState([]);


    const fetchNot = async () => {
        try {
            await RequestService.CleanAllOldFriendRequests(id);
            const { data, status } =
                await RequestService.ReturnRequestsExceptReportsById(id);
            if (status == 200) {
                console.log('uspeo fetch' + id);
                const requests = data.map((request) => ({
                    active: request.active,
                    type: request.type,
                    utility: RequestUtilityFactory.createRequestUlilityByName(request.type),
                    senderUsername: request.senderUsername,
                    receiverUsername: request.receiverUsername,
                    refersToUsername: request.refersToUsername,
                    senderPhoto: request.senderPhoto,
                    sendTime: request.sendTime,
                    referedGroup: request.referedGroup
                }));

                setNotifications(requests);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            fetchNot()
        }, 2000)

        return () => clearInterval(interval)

    }, []);

    useEffect(() => {
            fetchNot()
    }, []);


    async function acceptRequest(index){
        await notifications[index].utility.acceptRequest(notifications[index]);
        fetchNot();
    }

    async function rejectRequest(index){
        await notifications[index].utility.rejectRequest(notifications[index]);
        fetchNot();
    }


    function Row(props) {
        const { index, style } = props;
        const color = notifications[index].utility.getColorHexa();

        const [isLocationShare, setIsLocationShare] = useState(notifications[index].type === 'Location share');

        return (
            <ListItem style={style} key={index} component="div"  disablePadding>
                <ListItemAvatar>
                    <Avatar src={notifications[index].senderPhoto}></Avatar>
                </ListItemAvatar>
                {!isLocationShare && 
                    <ListItemText primary={notifications[index].senderUsername} secondary={notifications[index].type} />  
                }
                {isLocationShare && 
                    <ListItemText primary={notifications[index].senderUsername} secondary={`${notifications[index].type} for ${notifications[index].refersToUsername}`} />  
                }
                <Button variant="outlined" sx={{backgroundColor: '#8ea490'}} style={{color: 'black'}} onClick={async (e) => {await acceptRequest(index);}}>Accept</Button>
                <Button variant="outlined" sx={{backgroundColor: '#dadcda'}} style={{color: 'black'}}onClick={async (e) => {await rejectRequest(index);}}>Decline</Button>
            </ListItem>
        )
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: 480,
                maxWidth: 420,
                bgcolor: 'background.paper',
            }}
        >
            <FixedSizeList
                height={400}
                width={420}
                itemSize={46}
                itemCount={notifications.length}
                overscanCount={5}
            >
                {Row}
            </FixedSizeList>
        </Box>
    )
}
