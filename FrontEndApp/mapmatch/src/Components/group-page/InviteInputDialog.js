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

export default function InviteInputDialog({ inputCode }) {
    const [open, setOpen] = React.useState(false)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

    const [inputText, setInputText] = useState('')

    const handleInputChange = (event) => {
        setInputText(event.target.value)
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    async function handleJoinGroup() {
        //logika sta se desi kad mu je dobar kod
        // if (inputText === inputCode){
        //     setOpen(false)
        // } 
        // else{
        //     alert('Uneli ste netacan kod')
        // } 

        try {
            const myid = (await UserService.getMyId()).data
            await GroupService.addMemberByCode(inputText, myid)
            setOpen(false)
              
          } catch (error) {
              if (axios.isAxiosError(error) && error.response.status == 404) {
                  console.log(error.response.data)
              }
          }
      


    }

    return (
        <div>
            <h5>Join group with code!</h5>
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
                    Join
                </Button>
            </div>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Paste code
                </DialogTitle>
                <DialogContent>
                    <div>
                        <TextField
                            //id="outlined-multiline-static"
                            color="success"
                            label="Code"
                            // multiline
                            rows={4}
                            value={inputText}
                            onChange={handleInputChange}
                            borderColor="black"
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        style={{ color: 'black', borderColor: 'black' }}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleJoinGroup}
                        autoFocus
                        sx={{ color: 'green' }}
                    >
                        Join
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
