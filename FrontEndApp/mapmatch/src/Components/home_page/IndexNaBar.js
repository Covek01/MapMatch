import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import logo from '../profile_page/logoFinal.png'

export default function NavBar() {
    return (
        <div className="MainNav">
            <Box sx={{ flexGrow: 1 }}>
                <AppBar
                    position="static"
                    sx={{
                        background: '#8ea490',
                        position: 'static',
                        color: 'black',
                        opacity: '0.9',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <Toolbar sx={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            <img src={logo} width="140" height="140"></img>
                        </Typography>
                        <Button
                            component={Link}
                            to="/register"
                            className="TryBtn"
                            variant="outlined"
                            color="inherit"
                        >
                            Join now
                        </Button>
                        <Button
                            component={Link}
                            to="/login"
                            className="LogIn"
                            variant="outlined"
                            color="inherit"
                        >
                            Sign in
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    )
}
