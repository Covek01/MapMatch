import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bgImage from './login-bg.jpg'
import { GoogleLogin } from '@react-oauth/google'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Button from '@mui/material/Button'

export const Register = (props) => {
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

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [confirm, setConfirm] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [user, setUser] = useState('')
    const [birth, setBirth] = useState('')
    const [errorMessages, setErrorMessages] = useState({})
    const {
        errorPassLen,
        errorPassNum,
        errorPassCap,
        errorPassMatch,
        errorUser,
    } = errorMessages

    const navigate = useNavigate()

    const responseMessage = (response) => {
        console.log(response)
    }
    const handleLoginSuccess = () => {
        navigate('/map')
    }
    const errorM = (error) => {
        console.log(error)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Check if password is valid (e.g. at least 6 characters)
        if (pass.length < 8) {
            setErrorMessages(
                (errorPassLen = 'Please enter at least 8 characters.')
            )
        } else if (!/\d/.test(pass)) {
            setErrorMessages(
                (errorPassNum = 'Please include at least one number.')
            )
        } else if (!/[A-Z]/.test(pass)) {
            setErrorMessages(
                (errorPassCap = 'Please include at least one capital letter.')
            )
        } else if (pass !== confirm) {
            setErrorMessages((errorPassMatch = 'Passwords do not match.'))
        } else {
            setErrorMessages({
                errorPassLen: '',
                errorPassNum: '',
                errorPassCap: '',
                errorPassMatch: '',
                errorUser: '',
            })
        }
        try {
            const response = await axios.post(
                'https://localhost:7229/api/RegisteredUser/Register',
                {
                    firstName: firstname,
                    lastName: lastname,
                    username: user,
                    password: pass,
                    confirmPassword: confirm,
                    email: email,
                    dateOfBirth: birth,
                    isAdmin: false,
                }
            )

            navigate('/login')
        } catch (error) {
            // Registration failed, display the error message
            setErrorMessages((errorUser = error.response.data))
        }
        // const data=await response.data;
    }

    return (
        <div className="Main" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="auth-form-container">
                <h2>Sign up</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="name-input">
                        <label htmlFor="name">Name</label>
                        <input
                            value={firstname}
                            name="firstName"
                            onChange={(e) => setFirstName(e.target.value)}
                            id="firstName"
                            placeholder="First Name"
                        />
                        <input
                            value={lastname}
                            name="secondName"
                            onChange={(e) => setLastName(e.target.value)}
                            id="secondName"
                            placeholder="Last Name"
                        />
                    </div>
                    <label htmlFor="email">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="youremail@gmail.com"
                        id="email"
                        name="email"
                    />
                    <label htmlFor="user">Username</label>
                    <input
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        placeholder="my_username"
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
                    <label htmlFor="confirm">Confirm password</label>
                    <input
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        type="password"
                        placeholder="********"
                        id="conPassword"
                        name="conPassword"
                    />
                    <label htmlFor="password">Date of birth</label>
                    <input
                        value={birth}
                        onChange={(e) => setBirth(e.target.value)}
                        type="date"
                        id="birth"
                        name="birth"
                    />
                    <ThemeProvider theme={theme}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Sign up
                        </Button>
                    </ThemeProvider>
                    <div className="separator">
                        {' '}
                        <h6>Or join us with Google</h6>
                    </div>
                    <div className="googleBtn">
                        <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={errorM}
                        />
                    </div>
                    <div className="error-message">
                        {errorMessages.errorPassLen && (
                            <p className="error-message">
                                {errorMessages.errorPassLen}
                            </p>
                        )}
                        {errorMessages.errorPassNum && (
                            <p className="error-message">
                                {errorMessages.errorPassNum}
                            </p>
                        )}
                        {errorMessages.errorPassCap && (
                            <p className="error-message">
                                {errorMessages.errorPassCap}
                            </p>
                        )}
                        {errorMessages.errorPassMatch && (
                            <p className="error-message">
                                {errorMessages.errorPassMatch}
                            </p>
                        )}
                    </div>
                </form>
                <Link className="link-btn" to="/login">
                    Already have an account? Login here.
                </Link>
            </div>
        </div>
    )
}
