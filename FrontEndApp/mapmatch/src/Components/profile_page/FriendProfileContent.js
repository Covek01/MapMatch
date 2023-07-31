import * as React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { Button, Card, Typography } from '@mui/material'
import FriendsList from './FriendsList'
import ProfilePicture from './ProfilePicture'
import PopUp from './PopUp'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ChangeStatusDialog from './ChangeStatusDialog'
import { useState } from 'react'
import PhotoUploaderPopUp from './PhotoUploaderPopUp'
import DropDownFriends from './DropDownFriends'
import ListOfGroups from './ListOfFriends'
import PrimarySearchAppBar from './ProfilePageHeader'
import UserService from 'Services/UserService'
import axios from 'axios'
import { useEffect } from 'react'
import GroupList from 'Components/chat/GroupList'
import GroupListProfile from './GroupsListProfile'
import FriendshipService from 'Services/FriendshipService'
import FriendsPopUp from './FriendsPopUp'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import HomeIcon from '@mui/icons-material/Home'
import { emphasize, styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
//import { CreateSharp } from '@material-ui/icons'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import SendIcon from '@mui/icons-material/Send'
import SendTimeExtensionOutlinedIcon from '@mui/icons-material/SendTimeExtensionOutlined'
import NotListedLocationOutlinedIcon from '@mui/icons-material/NotListedLocationOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import { Label } from '@mui/icons-material'
import CssBaseline from '@mui/material/CssBaseline'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import RestoreIcon from '@mui/icons-material/Restore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ArchiveIcon from '@mui/icons-material/Archive'
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined'
import bgImage from './BackgroundNew.jpeg'
import RequestUtilityFactory from './objects/RequestUtilityFactory'
import GroupsPopUp from './GroupsPopUp'
import Input from '@mui/material/Input'
import RequestService from 'Services/RequestService'
import { check } from 'prettier'
import {
    Dialog,
    PaperComponent,
    DialogTitle,
    DialogContent,
    DialogContentText,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import MutualFriendsPopUp from './MutualFriendsPopUp'
import InviteInputDialog from 'Components/group-page/InviteInputDialog'
import NewgroupDialog from 'Components/group-page/NewGroupForm'

export default function ProfileContent() {
    const [savedStatusText, setSavedStatusText] = useState('')
    const [reportDialog, setReportDialog] = useState(false)
    const [reportText, setReportText] = useState('')
    const [profileInfo, setProfileInfo] = useState({})
    const { username: userNameParams } = useParams()
    const [isMe, setIsMe] = useState(false)
    const [isMyFriend, setIsMyFriend] = useState(true)
    const [value, setValue] = useState('')
    const [iAmBanned, setIAmBanned] = useState(false) //sets to true when you are banned
    const [friendsNoLonger, setFriendsNoLonger] = useState(false) //sets to true when you unfriend someone
    const [myId, setMyId] = useState(-1)

    //===============================status=================================
    const [editableStatus, setEditableStatus] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const handleSaveClick = async () => {
        // ovde sajemo serveru novi status
        await UserService.setStatus(editableStatus)
        setIsEditing(false)
    }
    //-----------------------------------------------
    const { id, name, username, photo, status } = profileInfo

    const handleStatusChange = (event) => {
        setEditableStatus(event.target.value)
    }

    const handleEditClick = () => {
        setIsEditing(true)
    }

    const handleReportProfile = async () => {
        setReportDialog(true)
    }

    useEffect(() => {
        const checkIfIamBanned = async () => {
            await RequestService.CleanAllReports()

            const myid = (await UserService.getMyId()).data
            const iAmBanned = (await UserService.checkIsUserBanned(myid)).data

            if (iAmBanned) {
                setIAmBanned(true)
            }
        }

        checkIfIamBanned()
    }, [])

    const handleGoBack = () => {
        // setShownUserId(id)
    }

    const handleUnfriend = async () => {
        try {
            const { data: myId } = await UserService.getMyId()
            console.log('moj id je ' + myId)
            console.log('id profila je ' + profileInfo.id)
            await FriendshipService.DeleteFriendship(myId, profileInfo.id)

            setIsMyFriend(false)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchProfileData = async () => {
        const { data: userInfo } = await UserService.getUserByUsername(
            userNameParams
        )
        const { data: myId } = await UserService.getMyId()
        const { data: friends } = await FriendshipService.GetFriendsForUser(
            userInfo.id
        )

        setIsMe(userInfo.id === myId)
        setMyId(myId)
        setIsMyFriend(friends.some((friend) => friend.id === myId))
        setProfileInfo({
            id: userInfo.id,
            username: userInfo.username,
            name: `${userInfo.firstName} ${userInfo.lastName}`,
            photo: userInfo.profilePhoto,
            status: userInfo.status,
        })
        setEditableStatus(userInfo.status)
    }

    useEffect(() => {
        fetchProfileData()
    }, [userNameParams])

    useEffect(() => {
        RequestService.CleanAllReports()
    })

    if (Object.keys(profileInfo).length === 0) return null

    return (
        <div style={{ backgroundImage: `url(${bgImage})` }}>
            <PrimarySearchAppBar />
            <div className="main-cont">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}
                    className="Main"
                >
                    <Paper
                        elevation={3}
                        sx={{
                            width: '100%',
                            maxWidth: 500,
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: '15px',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                    >
                        {isMyFriend && !isMe && (
                            <>
                                <Stack spacing={2}>
                                    <h5>
                                        Want to meet {username} in real life?
                                    </h5>
                                    <div>
                                        <IconButton
                                            component={Link}
                                            to="/message"
                                            aria-label="delete"
                                            size="small"
                                        >
                                            <SendTimeExtensionOutlinedIcon fontSize="inherit" />
                                        </IconButton>
                                        <Button
                                            component={Link}
                                            to="/message"
                                            variant="contained"
                                            className="costum-button"
                                        >
                                            message
                                        </Button>
                                    </div>

                                    <Divider
                                        orientation="horizontal"
                                        flexItem
                                    />
                                    <h5>Want to know where is {name}?</h5>
                                    <div>
                                        <IconButton
                                            component={Link}
                                            to={`/map?focus=${profileInfo.username}`}
                                            aria-label="delete"
                                            size="small"
                                        >
                                            <NotListedLocationOutlinedIcon fontSize="inherit" />
                                        </IconButton>
                                        <Button
                                            component={Link}
                                            to={`/map?focus=${profileInfo.username}`}
                                            className="costum-button"
                                            variant="contained"
                                        >
                                            Pinpoint
                                        </Button>
                                    </div>
                                    <Divider
                                        orientation="horizontal"
                                        flexItem
                                    />
                                    <h5>
                                        Something is wrong with the profile{' '}
                                        {username}? Allow us to help you!
                                    </h5>
                                    <div>
                                        <IconButton
                                            onClick={handleReportProfile}
                                            aria-label="delete"
                                            size="small"
                                        >
                                            <NotListedLocationOutlinedIcon fontSize="inherit" />
                                        </IconButton>
                                        <Button
                                            onClick={handleReportProfile}
                                            className="costum-button"
                                            variant="contained"
                                        >
                                            Report
                                        </Button>
                                    </div>
                                </Stack>
                            </>
                        )}
                        {!isMyFriend && !isMe && (
                            <div>
                                <Stack spacing={2}>
                                    <h5>
                                        You are not friends with {name} yet.
                                    </h5>
                                    <div>
                                        <IconButton
                                            component={Link}
                                            to="/map"
                                            aria-label="delete"
                                            size="small"
                                        >
                                            <SentimentDissatisfiedOutlinedIcon fontSize="inherit" />
                                        </IconButton>
                                        <Button
                                            component={Link}
                                            to="/map"
                                            className="costum-button"
                                            variant="contained"
                                        >
                                            Back to map
                                        </Button>
                                    </div>
                                    <Divider
                                        orientation="horizontal"
                                        flexItem
                                    />
                                    <h5>
                                        Something is wrong with the profile{' '}
                                        {username}? Allow us to help you!
                                    </h5>
                                    <div>
                                        <IconButton
                                            onClick={handleReportProfile}
                                            aria-label="delete"
                                            size="small"
                                        >
                                            <NotListedLocationOutlinedIcon fontSize="inherit" />
                                        </IconButton>
                                        <Button
                                            onClick={handleReportProfile}
                                            className="costum-button"
                                            variant="contained"
                                        >
                                            Report
                                        </Button>
                                    </div>
                                </Stack>
                            </div>
                        )}
                        {isMe && (
                            <div>
                                <Stack spacing={2}>
                                    <h5>Check if your friends are nearby!</h5>
                                    <div>
                                        <IconButton
                                            component={Link}
                                            to="/map"
                                            aria-label="delete"
                                            size="small"
                                        >
                                            <SendTimeExtensionOutlinedIcon fontSize="inherit" />
                                        </IconButton>
                                        <Button
                                            component={Link}
                                            to="/map"
                                            className="costum-button"
                                            variant="contained"
                                        >
                                            Find
                                        </Button>
                                    </div>
                                    <Divider
                                        orientation="horizontal"
                                        flexItem
                                    />
                                    <InviteInputDialog />
                                    <Divider
                                        orientation="horizontal"
                                        flexItem
                                    />
                                    <NewgroupDialog />
                                </Stack>
                            </div>
                        )}
                    </Paper>

                    <Paper
                        elevation={3}
                        sx={{
                            width: '100%',
                            maxWidth: 700,
                            height: '100%',
                            minHeight: '80vh',

                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            borderRadius: '15px',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                    >
                        <ProfilePicture photo={photo} />
                        {isMe && (
                            <>
                                <PhotoUploaderPopUp
                                    setPhoto={(photo) =>
                                        setProfileInfo({
                                            ...profileInfo,
                                            photo,
                                        })
                                    }
                                />
                            </>
                        )}
                        <Typography variant="h4">{name}</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {username}
                        </Typography>

                        <div
                            className="status"
                            style={{
                                border: '2px solid #744833',
                                borderRadius: '10px',
                                padding: '10px',
                            }}
                        >
                            {isEditing ? (
                                <Input
                                    value={editableStatus}
                                    onChange={handleStatusChange}
                                    fullWidth
                                    color="success"
                                />
                            ) : (
                                <Typography
                                    variant="body1"
                                    color="success"
                                    sx={{ mb: 2 }}
                                >
                                    {editableStatus}
                                </Typography>
                            )}
                            {isMe && (
                                <>
                                    {isEditing ? (
                                        <button onClick={handleSaveClick}>
                                            Save
                                        </button>
                                    ) : (
                                        <>
                                            <Divider></Divider>
                                            <button
                                                style={{
                                                    color: 'black',
                                                }}
                                                onClick={handleEditClick}
                                            >
                                                Edit
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        <ChangeStatusDialog
                            openDialog={reportDialog}
                            setOpenDialog={setReportDialog}
                            setReportText={setReportText}
                            idReported={profileInfo.id}
                        ></ChangeStatusDialog>
                        <Stack
                            direction="row"
                            divider={
                                <Divider orientation="vertical" flexItem />
                            }
                            spacing={2}
                        >
                            {isMe && (
                                <FriendsPopUp
                                    id={profileInfo.id}
                                ></FriendsPopUp>
                            )}
                            {!isMe && isMyFriend && (
                                <FriendsPopUp
                                    id={profileInfo.id}
                                ></FriendsPopUp>
                            )}
                            {!isMe && !isMyFriend && (
                                <MutualFriendsPopUp
                                    id={profileInfo.id}
                                ></MutualFriendsPopUp>
                            )}
                            <GroupsPopUp id={profileInfo.id}></GroupsPopUp>
                        </Stack>
                        {isMyFriend && (
                            <>
                                <Button
                                    variant="contained"
                                    className="unfriendBtn"
                                    onClick={handleUnfriend}
                                >
                                    Unfriend
                                </Button>
                            </>
                        )}
                        {friendsNoLonger && (
                            <>
                                <Typography variant="subtitle1" gutterBottom>
                                    You are no longer friends
                                </Typography>
                            </>
                        )}
                    </Paper>

                    <Dialog
                        open={iAmBanned}
                        // PaperComponent={PaperComponent}
                        aria-labelledby="draggable-dialog-title"
                    >
                        <DialogTitle
                            style={{ cursor: 'move' }}
                            id="draggable-dialog-title"
                        >
                            YOU ARE SUSPENDED!
                        </DialogTitle>
                        <DialogContent>
                            <CloseIcon
                                sx={{ width: 200, height: 200 }}
                            ></CloseIcon>
                            <DialogContentText sx={{ maxWidth: 200 }}>
                                You won't be able to use this app for a while.
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>
                </Box>
            </div>
        </div>
    )
}
