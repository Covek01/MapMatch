import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import PhotoUploadComponent from './PhotoUploader'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import RequestsList from './RequestsList'
import { IdentificationIcon } from '@heroicons/react/20/solid'
import FriendshipService from 'Services/FriendshipService'
import UserService from 'Services/UserService'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import GroupService from 'Services/GroupService'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export default function GroupsPopUp({ id }) {
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
    const [open, setOpen] = React.useState(() => false)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
    // const [people, setPeople] = useState(initialPeople)
    const [groups, setGroups] = useState([])
    const [myId, setMyId] = useState(null)

    const navigate = useNavigate()
    const handleSubmit = (groupId) => {
        return () => {
            //--------- da uzememo id prijatelja
            setOpen(false)
            navigate(`/group/${groupId}/${myId}`)
        }
    }
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const { data, status } = await GroupService.getGroups(id)
                if (status == 200) {
                    //console.log('ovo je id sa deteta' + id)
                    const groups = data.map((group) => ({
                        id: group.id,
                        name: group.name,
                        photoPath: group.photoPath,
                    }))

                    setGroups(groups)
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response.status == 404) {
                    console.log(error.response.data)
                }
            }
        }
        fetchGroups()
    }, [id])

    const fetchProfileData = async () => {
        const { data: idValue } = await UserService.getMyId()

        setMyId(idValue)
    }

    const fetchUsername = async () => {
        const { data: info } = await UserService.getMyInfo(myId)
    }

    useEffect(() => {
        fetchProfileData()
    }, [])

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <ThemeProvider theme={btnTheme}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                >
                    Groups
                </Button>
            </ThemeProvider>
            <Dialog
                // fullScreen={fullScreen}
                maxWidth="xs"
                fullWidth={true}
                aria-describedby="alert-dialog-slide-description"
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <div className="popUpFriends">
                    <DialogTitle id="responsive-dialog-title">
                        Groups
                    </DialogTitle>
                    <DialogContent>
                        <ul role="list" className="divide-y divide-gray-100">
                            {groups.map((group) => (
                                <li
                                    onClick={handleSubmit(group.id)}
                                    key={group.id}
                                    className="flex justify-between gap-x-6 py-5  rounded   hover:bg-gradient-to-b from-gray-300 to-transparent"
                                >
                                    <div className="flex gap-x-4">
                                        <img
                                            className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                            src={group.photoPath}
                                            alt=""
                                        />
                                        <div className="min-w-0 flex-auto">
                                            <p className="text-sm font-semibold leading-6 text-gray-900">
                                                {group.name}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleClose}
                            autoFocus
                            style={{ color: 'black', borderColor: 'black' }}
                        >
                            OK
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    )
}
