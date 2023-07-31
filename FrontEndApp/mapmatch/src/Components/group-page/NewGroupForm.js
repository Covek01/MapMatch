import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import UserService from 'Services/UserService'
import GroupService from 'Services/GroupService'
import axios from 'axios'

export default function NewgroupDialog({ inputCode }) {
    const [open, setOpen] = React.useState(false)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

    const [inputText, setInputText] = useState('Group name')

    const handleInputChange = (event) => {
        setInputText(event.target.value)
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    async function handleCreateGroup() {
        //logika sta se desi kad mu je dobar kod
        if (inputText === 'Group name'){
            setOpen(false)
            alert('Unesite neko ime grupe')
            return
        } 

        try {
            const myid = (await UserService.getMyId()).data
            const adminId = myid
            const groupName = inputText
            const groupObject = {
                name: groupName, 
                joinCode: null,
                preferedColor: null,
                photoPath: null,
                adminId: adminId
            }
            await GroupService.createGroup(groupObject)
            setOpen(false)
              
          } catch (error) {
              if (axios.isAxiosError(error) && error.response.status == 404) {
                  console.log(error.response.data)
              }
          }
    }

    return (
        <div>
            <h5>Create new group now</h5>
            <div>
                <IconButton
                    // component={Link}
                    // to="/map"
                    aria-label="delete"
                    size="small"
                    onClick={handleClickOpen}
                >
                    <GroupAddIcon fontSize="inherit" />
                </IconButton>
                <Button
                    // component={Link}
                    // to="/map"
                    className="costum-button"
                    variant="contained"
                    onClick={handleClickOpen}
                    sx={{ mt: 2 }}
                >
                    Create
                </Button>
            </div>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <TextField
                    required
                    id="filled-required"
                    label="Required"
                    defaultValue="Group name"
                    variant="filled"
                    color="success"
                    onChange={(e) => {
                        setInputText(e.target.value)
                    }}
                />
                <DialogActions>
                    <Button
                        autoFocus
                        style={{ color: 'black', borderColor: 'black' }}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateGroup}
                        autoFocus
                        sx={{ color: 'green' }}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
