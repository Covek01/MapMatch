import axios from 'axios'
import Button from '@mui/material/Button'
import React, { useEffect, useState } from 'react'
import { Link, json, redirect, useNavigate } from 'react-router-dom'
import { LoginUser } from 'models/LogInUser.model'
import bgImage from './login-bg.jpg'
import { GoogleLogin } from '@react-oauth/google'
import { useAuthContext } from 'Context/AuthContext/AuthContext'
import UserService from 'Services/UserService'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { LoadingSpinner } from "Components/loadingSpinner/LoadingSpinner";

export const Login = (props) => {
    const theme = createTheme({
        palette: {
            primary: {
                // Purple and green play nicely together.
                main: '#314f4d',
            },
            secondary: {
                // This is green.A700 as hex.
                main: '#dadcda',
            },
        },
    })
    const [loading, setLoading] = useState();

    const [errorMessage, setErrorMessage] = useState(null)
    const navigate = useNavigate()
    const { isAuthenticated, signIn, user, signOut } = useAuthContext()

    const [username, setUsername] = useState('')
    const [pass, setPass] = useState('')

    useEffect(() => {
        if (isAuthenticated()) redirect('/map')
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
            const userResponse = await UserService.signIn({
                username: username,
                password: pass,
            })
            const userData = userResponse.data
            let user = new LoginUser(userData)
            signIn({ user: user, authToken: userData.token })
            navigate(`/profile/${userData.username}`)
            setLoading(false);

        } catch (error) {
            setErrorMessage(error.response.data.message)
            setLoading(false);
            console.log('ovo je error:' + error.response.data.message)
        }
    }

    return (
        <>
            {loading && (
                <div className="flex flex-grow justify-center absolute top-1/2 left-1/2 z-50 w-32 h-32 bg-gray-500 opacity-70 rounded-md">
                    <div className="flex flex-col justify-center">
                        <LoadingSpinner />
                    </div>
                </div>
            )}
            <div className="Main" style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="auth-form-container">
                    <h2>Login</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="username"
                            placeholder="yourUsername"
                            id="username"
                            name="username"
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            type="password"
                            placeholder="********"
                            id="password"
                            name="password"
                        />
                        <ThemeProvider theme={theme}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Log In
                            </Button>
                        </ThemeProvider>
                        {errorMessage === undefined && (
                            <div className="error-message">
                                <label>Invalid pasword or username</label>
                            </div>
                        )}

                        {/* <input
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        type="password"
                        placeholder="********"
                        id="password"
                        name="password"
                    /> */}
                        {/* <button type="submit">Log In</button> */}
                    </form>

                    <Link className="link-btn" to="/register">
                        Don't have an account? Register here.
                    </Link>
                </div>
            </div>
        </>
    )
}
