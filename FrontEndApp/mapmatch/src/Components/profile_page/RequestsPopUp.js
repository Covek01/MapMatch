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

export default function RRequestsPopUp({ openDialog, handleCloseDialog }) {
    const [open, setOpen] = React.useState(false)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

    const handleClose = () => {
        console.log('stigao')
        const z = handleCloseDialog
        openDialog = false
        setOpen(false)
        console.log('nakon promene')
        console.log(openDialog)
    }

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <div className="requestPopUp">
                    <DialogTitle id="responsive-dialog-title">
                        {'Obavestenja'}
                    </DialogTitle>
                    <DialogContent>
                        <RequestsList />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleClose}
                            style={{
                                color: 'black !important',
                            }}
                            sx={{ backgroundColor: '#8ea490 !important' }}
                            autoFocus
                        >
                            Close
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    )
}
