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
import { redirect, useNavigate, useParams } from 'react-router-dom'
import GroupService from 'Services/GroupService'

export default function GroupMembers({ id, adminId }) {
    const [open, setOpen] = React.useState(() => false)
    const theme = useTheme()
    const { groupId, userId } = useParams()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
    // const [people, setPeople] = useState(initialPeople)
    const [people, setPeople] = useState([])
    const [admin, setAdmin] = useState(null)
    const [buttonStates, setButtonStates] = useState({})

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
                    await GroupService.getFriendsNotInGroup(groupId)
                if (status == 200) {
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
                if (axios.isAxiosError(error)) {
                    console.log(error.response.data)
                }
            }
        }
        fetchPeople()
    }, [])

    useEffect(() => {
        const getAdmin = async () => {
            try {
                const { data, status } = await GroupService.getGroupAdmin(
                    groupId
                )
                if (status == 200) {
                    setAdmin(data)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log(error.response.data)
                }
            }
        }
        getAdmin()
    }, [])

    useEffect(() => {
        const checkRequests = async (idPerson) => {
            try {
                const { data, status } =
                    await GroupService.checkIfGroupRequestExist(
                        admin,
                        idPerson,
                        groupId
                    )
                if (status == 200) {
                    console.log('proverili smo zahteve!!!!!!!!!!!!!!!!!!!!!!!!')
                }

                setButtonStates((buttonStates) => ({
                    ...buttonStates,
                    [idPerson]: data,
                }))
            } catch (error) {
                console.log('MEMBERSSSSSSSSSS adminnn')
                console.log('ovo je id ' + id)
                if (axios.isAxiosError(error)) {
                    console.log(error.response.data)
                }
            }
        }
        people.map((person) => checkRequests(person.id))
    }, [admin, people])

    const handleInvite = (idFriend) => {
        const sendInvite = async () => {
            try {
                const idGroup = Number(groupId)
                const { status } = await GroupService.sendGroupRequest(
                    adminId,
                    idFriend,
                    idGroup
                )
                if (status == 200) {
                    console.log('poslat zahtev za grupu ')
                }
            } catch (error) {
                console.log('group request ERROR')
                if (axios.isAxiosError(error)) {
                    console.log(error.response.data)
                }
            }
        }
        sendInvite()
        setButtonStates((buttonStates) => ({
            ...buttonStates,
            [idFriend]: true,
        }))
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <Button
                variant="contained"
                style={{ backgroundColor: '#8ea490' }}
                onClick={handleClickOpen}
            >
                Friends
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle
                    style={{ color: '#8ea490' }}
                    id="responsive-dialog-title"
                >
                    Friends
                </DialogTitle>
                <DialogContent>
                    <ul role="list" className="divide-y divide-gray-100">
                        {people.map((person) => (
                            <li
                                key={person.username}
                                className="flex justify-between gap-x-6 py-5"
                            >
                                <div className="flex gap-x-4">
                                    <img
                                        className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                        src={person.imageUrl}
                                        alt=""
                                        onClick={handleSubmit(
                                            person.id,
                                            person.username
                                        )}
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

                                <Button
                                    disabled={buttonStates[person.id]}
                                    variant="contained"
                                    style={{ backgroundColor: '#8ea490' }}
                                    onClick={() => handleInvite(person.id)}
                                >
                                    {buttonStates[person.id]
                                        ? 'Invited'
                                        : 'Invite'}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        style={{ color: '#8ea490', borderColor: '#8ea490' }}
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
