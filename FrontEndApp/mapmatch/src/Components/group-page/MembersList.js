import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import { IdentificationIcon } from '@heroicons/react/20/solid'
import FriendshipService from 'Services/FriendshipService'
import UserService from 'Services/UserService'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom'

export default function FriendsPopUp({ id}) {
    const [open, setOpen] = React.useState(() => false)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
    // const [people, setPeople] = useState(initialPeople)
    const [people, setPeople] = useState([])
    const navigate = useNavigate()
    const handleSubmit = (personId, personUsername) => {
        
        return () => {
            //--------- da uzememo id prijatelja
            setOpen(false);
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
            <Button variant="contained" onClick={handleClickOpen}>
                Friends
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                   Friends
                </DialogTitle>
                <DialogContent>
                <ul role="list" className="divide-y divide-gray-100">
            {people.map((person) => (
                <li
                    onClick={handleSubmit(person.id, person.username)}
                    key={person.username}
                    className="flex justify-between gap-x-6 py-5"
                >
                    <div className="flex gap-x-4">
                        <img
                            className="h-12 w-12 flex-none rounded-full bg-gray-50"
                            src={person.imageUrl}
                            alt=""
                        />
                        <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">
                                {person.name}
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
                                <time dateTime={person.lastSeenDateTime}>
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
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleClose} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
