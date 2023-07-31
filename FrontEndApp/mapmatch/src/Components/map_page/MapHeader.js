import React from 'react'
import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import { ButtonGroup } from '@mui/material'
import MapPage from './MapPage'
import IconButton from '@mui/material/IconButton'
import MailIcon from '@mui/icons-material/Mail'
import Badge from '@mui/material/Badge'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MenuItem from '@mui/material/MenuItem'
import UserService from 'Services/UserService'
import RequestService from 'Services/RequestService'
import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import PublicIcon from '@mui/icons-material/Public'
import Menu from '@mui/material/Menu'
import MoreIcon from '@mui/icons-material/MoreVert'
import { redirect, useNavigate } from 'react-router-dom'
import { useAuthContext } from 'Context/AuthContext/AuthContext'


import AccountCircle from '@mui/icons-material/AccountCircle'
import { Link } from 'react-router-dom'
import ReportIcon from '@mui/icons-material/Report'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import ReportsList from 'Components/profile_page/ReportsList'
import RequestsList from '../profile_page/RequestsList'
import logo from '../profile_page/logo.png'

export default function MapHeader({
    profileUsername,
    otherUsersData,
    setSelectedUserIndex,
    userId,
    friends,
    groupMembers,
    myLocation,
    defaultCenter,
    setSearchClicked,
}) {
    const { signOut } = useAuthContext()

    useEffect(() => {
        const getAllNotifications = async () => {
            try {
                const myid = (await UserService.getMyId()).data
                const { data, status } =
                    await RequestService.ReturnRequestsExceptReportsById(userId)

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
    const navigate = useNavigate()

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
    const [notificationsCount, setNotificationsCount] = useState(0)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [openReports, setOpenReports] = useState(false)
    const [username, setUsername] = useState(false)

    const [iAmAdmin, setIAmAdmin] = useState(false)
    const [reportsCount, setReportsCount] = useState(false)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
    const [open, setOpen] = useState(false)

    const handleOpenDialog = () => {
        setOpen(true)
    }

    const handleCloseDialog = () => {
        console.log('hej')
        setOpen(false)
        console.log(open)
    }

    // useEffect(() =>{
    //     const getAllReports = async () =>{
    //     try{
    //         const myid = (await UserService.getMyId()).data
    //         const flag = UserService.isAdmin(myid)
    //         if (!flag){
    //             return
    //         }
    //         const {data, status} = (await RequestService.ReturnReportsToAdmin(myid)).data

    //         if (status == 200) {
    //             setReportsCount(data.length)
    //             console.log(data)
    //         }
    //     }
    //     catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             console.error(error.message)
    //         }
    //     }
    // }

    //     getAllReports()
    // })

    const onSearch = () => {
        otherUsersData.forEach((userInfo, index) => {
            if (userInfo.username === searchQuery) {
                setSelectedUserIndex(index)
                return
            }
        })
        alert('Uneti korisnik nije pronadjen.')
    }

    const handleOpenReportDialog = (e) => {
        setOpenReports(true)
    }

    const handleCloseReportDialog = (e) => {
        setOpenReports(false)
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

    function handleRecenter() {
        if (myLocation != null) {
            setSelectedUserIndex(userId)
            setSearchClicked((prev) => !prev)
        } else {
            setSelectedUserIndex(null)
            setSearchClicked((prev) => !prev)
        }
    }
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const menuId = 'primary-search-account-menu'

    const isMenuOpen = Boolean(anchorEl)
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

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

    const handleOpenProfile = () => {
        navigate(`/profile/${username}`)
    }
    function handleLogOut() {
        signOut()
    }

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
            <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
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
                    to="/message"
                >
                    <Badge color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
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

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                sx={{
                    background: '#8ea490',
                    position: 'static',
                    color: 'black',
                    opacity: '0.8',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
            >
                <Toolbar>
                    <img src={logo} width="140" height="140"></img>

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <SearchBar
                            setSelectedUserIndex={setSelectedUserIndex}
                            otherUsersData={otherUsersData}
                            userId={userId}
                            setSearchClicked={setSearchClicked}
                        ></SearchBar>

                        <IconButton
                            size="large"
                            aria-label="show 4 new mails"
                            color="inherit"
                            component={Link}
                            to="/message"
                        >
                            <Badge color="error">
                                <MailIcon />
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
                                    <ReportsList id={userId} />
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
                                    <RequestsList id={userId} />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        color="success"
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
