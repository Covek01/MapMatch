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
import { createTheme, ThemeProvider } from '@mui/material/styles'

export default function FriendsPopUp({ id }) {
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
    const [people, setPeople] = useState([])
    const navigate = useNavigate()
    const handleSubmit = (personId, personUsername) => {
        return () => {
            //--------- da uzememo id prijatelja
            setOpen(false)
            navigate(`/profile/${personUsername}`)
        }
    }
    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const { data, status } =
                    await FriendshipService.GetFriendsForUser(id)
                if (status == 200) {
                    console.log('ovo je id sa deteta' + id)
                    const people = data.map((person) => ({
                        id: person.id,
                        name: person.name,
                        imageUrl: person.profilePhoto,
                        username: person.username,
                        email: person.email,
                    }))

                    setPeople(people)
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response.status == 404) {
                    console.log(error.response.data)
                }
            }
        }
        fetchPeople()
    }, [id])

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
                    Friends
                </Button>
            </ThemeProvider>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth={true}
                aria-describedby="alert-dialog-slide-description"
                sx={{ borderRadius: '50px' }}
                rounded

                //rounded
                //  aria-labelledby="responsive-dialog-title"
            >
                <div className="popUpFriends">
                    <DialogTitle
                        id="responsive-dialog-title"
                        sx={{ borderRadius: '15px' }}
                    >
                        Friends
                    </DialogTitle>
                    <DialogContent>
                        <ul role="list" className="divide-y divide-gray-100">
                            {people.map((person) => (
                                <li
                                    onClick={handleSubmit(
                                        person.id,
                                        person.username
                                    )}
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
                                            <p className="text-sm font-semibold leading-6 text-black-900">
                                                {person.username}
                                            </p>
                                            <p className="mt-1 truncate text-xs leading-5 text-grey-600">
                                                {person.email}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            style={{ color: 'black', borderColor: 'black' }}
                            onClick={handleClose}
                        >
                            OK
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    )
}
