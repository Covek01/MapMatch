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
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import RequestsList from './RequestsList'

export default function PopUp({ children, textForTitle }) {
    const [open, setOpen] = React.useState(() => false)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                {textForTitle}
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {textForTitle}
                </DialogTitle>
                <DialogContent>{children}</DialogContent>
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
