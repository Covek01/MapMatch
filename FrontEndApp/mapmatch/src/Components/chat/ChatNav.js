import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Badge from '@mui/material/Badge'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MailIcon from '@mui/icons-material/Mail'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreIcon from '@mui/icons-material/MoreVert'
import ReportIcon from '@mui/icons-material/Report'
import { Link, useNavigate } from 'react-router-dom'

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import RequestsList from '../profile_page/RequestsList'
import RRequestsPopUp from '../profile_page/RequestsPopUp'
import { useEffect, useState } from 'react'
import UserService from 'Services/UserService'
import axios from 'axios'
import PhotoUploaderPopUp from '../profile_page/PhotoUploaderPopUp'
import RequestService from 'Services/RequestService'
import ReportsList from '../profile_page/ReportsList'
import PublicIcon from '@mui/icons-material/Public'
import logo from '../profile_page/logoFinal.png'

export default function ChatNavBar() {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
    const [open, setOpen] = useState(false)
    const [openReports, setOpenReports] = useState(false)
    const [openNotifications, setNotifications] = useState(false)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
    const [id, setId] = useState(-1)
    const [notificationsCount, setNotificationsCount] = useState(0)
    const [reportsCount, setReportsCount] = useState(0)
    const [iAmAdmin, setIAmAdmin] = useState(false)
    const navigate = useNavigate()
    const [username, setUsername] = useState('')

    useEffect(() => {
        const getAllNotifications = async () => {
            try {
                const myid = (await UserService.getMyId()).data
                const { data, status } =
                    await RequestService.ReturnRequestsExceptReportsById(myid)

                if (status == 200) {
                    setNotificationsCount(data.length)
                    console.log(data)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.message)
                }
            }
        }

        getAllNotifications()
    })

    useEffect(() => {
        const getAllReports = async () => {
            try {
                const myid = (await UserService.getMyId()).data
                const { data, status } =
                    await RequestService.ReturnReportsToAdmin(myid)

                if (status == 200) {
                    setReportsCount(data.length)
                    console.log(data)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.message)
                }
            }
        }

        getAllReports()
    })

    useEffect(() => {
        const getMyId = async () => {
            try {
                const { data, status } = await UserService.getMyId()
                if (status == 200) {
                    setId(data)
                    console.log(data)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.message)
                }
            }
        }

        getMyId()
    }, [])
    useEffect(() => {
        const getMyUsername = async () => {
            try {
                const { data, status } = await UserService.getMyInfo()
                if (status == 200) {
                    setUsername(data.username)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.message)
                }
            }
        }

        getMyUsername()
    }, [])

    const handleOpenProfile = () => {
        {
            navigate(`/profile/${username}`)
        }
    }
    useEffect(() => {
        const renderReportButtonIfIAmAdmin = async () => {
            try {
                const myid = (await UserService.getMyId()).data
                const { data, status } = await UserService.getRole(myid)
                if (status == 200) {
                    if (data == 'admin') {
                        setIAmAdmin(true)
                    }
                    console.log(data)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.message)
                }
            }
        }

        renderReportButtonIfIAmAdmin()
    }, [])

    const handleOpenDialog = () => {
        setOpen(true)
    }

    const handleCloseDialog = () => {
        console.log('hej')
        setOpen(false)
        console.log(open)
    }

    console.log(open)

    const isMenuOpen = Boolean(anchorEl)
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

    const handleOpenReportDialog = (e) => {
        setOpenReports(true)
    }

    const handleCloseReportDialog = (e) => {
        setOpenReports(false)
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        handleMobileMenuClose()
    }

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget)
    }

    const menuId = 'primary-search-account-menu'
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Log Out</MenuItem>
            <MenuItem onClick={handleOpenProfile}>Go to profile</MenuItem>
        </Menu>
    )

    const mobileMenuId = 'primary-search-account-menu-mobile'
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                {iAmAdmin && (
                    <>
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                            onClick={handleOpenReportDialog}
                        >
                            <Badge badgeContent={reportsCount} color="error">
                                <ReportIcon />
                            </Badge>
                        </IconButton>
                        <p>Reports</p>
                    </>
                )}
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 4 new mails"
                    color="inherit"
                    component={Link}
                    to="/map"
                >
                    <Badge color="error">
                        <PublicIcon />
                    </Badge>
                </IconButton>
                <p>Map</p>
            </MenuItem>

            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                    onClick={handleOpenDialog}
                >
                    <Badge color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    )
    console.log({ open })
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                enableColorOnDark
                sx={{
                    background: '#8ea490',
                    position: 'static',
                    color: 'black',
                    opacity: '0.7',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
            >
                <Toolbar>
                    <img src={logo} width="140" height="140"></img>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            aria-label="show 4 new mails"
                            color="inherit"
                            component={Link}
                            to="/map"
                        >
                            <Badge color="error">
                                <PublicIcon />
                            </Badge>
                        </IconButton>

                        {iAmAdmin ? (
                            <IconButton
                                size="large"
                                aria-label="show 17 new notifications"
                                color="inherit"
                                onClick={handleOpenReportDialog}
                            >
                                <Badge
                                    badgeContent={reportsCount}
                                    color="error"
                                >
                                    <ReportIcon />
                                </Badge>
                            </IconButton>
                        ) : (
                            <div></div>
                        )}

                        <div>
                            <Dialog
                                fullScreen={fullScreen}
                                open={openReports}
                                onClose={handleCloseReportDialog}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    {'Reports'}
                                </DialogTitle>
                                <DialogContent>
                                    <ReportsList id={id} />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={handleCloseReportDialog}
                                        sx={{
                                            backgroundColor: '#dadcda',
                                            color: 'white',
                                        }}
                                        autoFocus
                                    >
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>

                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                            onClick={handleOpenDialog}
                        >
                            <Badge
                                badgeContent={notificationsCount}
                                color="error"
                            >
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <div>
                            <Dialog
                                fullScreen={fullScreen}
                                open={open}
                                onClose={handleCloseDialog}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">
                                    {'Obavestenja'}
                                </DialogTitle>
                                <DialogContent>
                                    <RequestsList id={id} />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        onClick={handleCloseDialog}
                                        sx={{
                                            backgroundColor: '#dadcda',
                                            color: 'black',
                                        }}
                                        autoFocus
                                    >
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    )
}
