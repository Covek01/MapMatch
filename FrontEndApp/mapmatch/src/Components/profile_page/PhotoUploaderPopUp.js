import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import PhotoUploadComponent from './PhotoUploader'
import { useState } from 'react'
import Divider from '@mui/material/Divider'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import HomeIcon from '@mui/icons-material/Home'
import { emphasize, styled } from '@mui/material/styles'
import { Paper } from '@mui/material'
import PhotoUploadService from 'Services/PhotoUploadService'
import UserService from 'Services/UserService'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function PhotoUploaderPopUp({ setPhoto }) {
    const [open, setOpen] = React.useState(false)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
    const { username } = useParams();
    const [newPhoto, setNewPhoto] = useState('')

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    async function handleSave() {
        //setPhoto(newPhoto);
        setOpen(false);
        const response = await PhotoUploadService.UploadPhotoToApi(newPhoto);
        //console.log(username, "OVO SU IDS KOJI MI TREBAJU");
        setPhoto(response.data.url);
        const getIdFromUsername = async () => {
            try {
                const { data, status } = await UserService.getIdFromUsername(username);
                if (status == 200) {
                    await UserService.setProfilePhoto(data,response.data.url);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.message);
                }
            }
        }
        getIdFromUsername();
    }


    return (
        <div>
            <Chip
                variant="contained"
                className="small-costum-button"
                style={{ color: 'black', borderColor: 'black' }}
                onClick={handleClickOpen}
                label="Promeni profilnu sliku"
            >
                Change profile picture
            </Chip>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Change profile picture
                </DialogTitle>
                <DialogContent>
                    <PhotoUploadComponent setNewPhoto={setNewPhoto} />
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
                        className="costum-button"
                        onClick={handleSave}
                        autoFocus
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
