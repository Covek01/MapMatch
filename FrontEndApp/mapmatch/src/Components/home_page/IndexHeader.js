import './App.css'

import Button from '@mui/material/Button'
import NavBar from './IndexNaBar'
import React from 'react'
import { Container } from '@mui/material'
import bgImage from './glavna.jpg'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import logo from '../profile_page/logoFinal.png'

function IndexHeader() {
    const navigate = useNavigate()
    const responseMessage = (response) => {
        console.log(response)
    }

    return (
        <div className="MainForIndex">
            <NavBar></NavBar>
            <div
                className="page-header section-dark"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="filter" />
                <div className="content-center">
                    <Container>
                        <div className="title-brand">
                            <h1 className="presentation-title">MapMatch</h1>
                        </div>
                        <h2 className="presentation-subtitle text-center">
                            Connect with the right people, find new friends, and
                            enjoy good times in the real world!
                        </h2>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                component={Link}
                                to="/register"
                                style={{ color: '#ffffff' }}
                                className="SignUp"
                                variant="outlined"
                            >
                                Sign Up
                            </Button>
                        </div>
                        <h4 className="paragraf">
                            MapMatch is free to try for as long as you’d like
                        </h4>
                    </Container>
                </div>
            </div>
        </div>
    )
}

export default IndexHeader
