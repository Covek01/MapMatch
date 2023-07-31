import { useEffect, useState } from "react"
import {Dialog, DialogTitle, DialogActions,
DialogContent, DialogContentText, Button,
 Box, ListItem, ListItemAvatar, Avatar, ListItemText, useTheme} from '@mui/material'
 import FriendshipService from "Services/FriendshipService"
 import axios from "axios"
 import { Fullscreen } from "@mui/icons-material"
 import { FixedSizeList } from "react-window"
 import { useMediaQuery } from "@mui/material"
 import { ThemeProvider } from "styled-components"
 import { createTheme } from "@mui/material"



const MutualFriendsPopUp = ({myId, hisId}) => {
    const btnTheme = createTheme({
        palette: {
            primary: {
                // Purple and green play nicely together.
                main: '#314f4d',
            },
            secondary: {
                // This is green.A700 as hex.
                main: '#dadcda',
            },
        },
    })

    const [mutualFriends, setMutualFriends] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)




    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

    useEffect(() => {
        const fetchMutualFriends = async () => {
            try {
                const { data, status } =
                    await FriendshipService.GetMutualFriends(myId, hisId)
                if (status == 200) {
                    console.log('uspeo fetch');
                    const mutualFriends = data.map((user) => ({
                        id: user.id,
                        username : user.username,
                        photo: user.profilePhoto
                    }));
    
                    setMutualFriends(mutualFriends)
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response.status == 404) {
                    console.log(error.response.data)
                }
            }
        }

        fetchMutualFriends()
    }, [])

    const handleOpenDialog = () => {
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setDialogOpen(false)
    }

    function Row(props) {
        const { index, style } = props;

        return (
            <ListItem style={style} key={index} component="div"  disablePadding>
                <ListItemAvatar>
                    <Avatar src={mutualFriends[index].photo}></Avatar>
                </ListItemAvatar>
                <ListItemText primary={mutualFriends[index].username}>                
                </ListItemText>
            </ListItem>
        )
    }


    return (
        <>
            <ThemeProvider theme={btnTheme}>
                <Button
                    variant="contained"
                    //color="primary"
                    onClick={handleOpenDialog}
                    sx={{backgroundColor: "#314f4d",  "&:hover": {
                                        backGroundColor: "#dadcda !important"
                      }}}
                >
                    Mutual friends
                </Button>
            </ThemeProvider>

            {/* <Dialog
                fullScreen={fullScreen}
                open={dialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Mutual friends
                </DialogTitle>
                <DialogContent>
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
                            itemCount={mutualFriends.length}
                            overscanCount={5}
                        >
                            {Row}
                        </FixedSizeList>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{
                            backgroundColor: '#dadcda',
                            color: 'black',
                        }}
                        autoFocus
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog> */}




            <Dialog
                //fullScreen={fullScreen}
                open={dialogOpen}
                onClose={handleCloseDialog}
                //  aria-labelledby="responsive-dialog-title"
            >
                <div className="popUpFriends">
                    <DialogTitle id="responsive-dialog-title">
                        Mutual Friends
                    </DialogTitle>
                    <DialogContent>
                        <ul role="list" className="divide-y divide-gray-100">
                            {mutualFriends.map((person) => (
                                <li
                                    key={person.username}
                                    className="flex justify-between gap-x-6 py-5  rounded   hover:bg-gradient-to-b from-gray-300 to-transparent"
                                >
                                    <div className="flex gap-x-4  ">
                                        <img
                                            className="h-12 w-12 flex-none rounded-full bg-gray-150"
                                            src={person.imageUrl}
                                            alt=""
                                        />
                                        <div className="min-w-0 flex-auto">
                                            <p className="text-sm font-semibold leading-6 text-gray-900">
                                                {person.username}
                                            </p>
                                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                                {person.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex sm:flex-col sm:items-end">
                                        <p className="text-sm leading-6 text-gray-900">
                                            {person.role}
                                        </p>
                                        {person.lastSeen ? (
                                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                                Last seen{' '}
                                                <time
                                                    dateTime={
                                                        person.lastSeenDateTime
                                                    }
                                                >
                                                    {person.lastSeen}
                                                </time>
                                            </p>
                                        ) : (
                                            <div className="mt-1 flex items-center gap-x-1.5">
                                                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                </div>
                                                <p className="text-xs leading-5 text-gray-500">
                                                    Online
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            style={{ color: 'black', borderColor: 'black' }}
                            onClick={handleCloseDialog}
                        >
                            OK
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    )

}

export default MutualFriendsPopUp