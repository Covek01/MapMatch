import React from 'react'
import { Box, List, ListItem, Paper } from '@mui/material'
import UserService from 'Services/UserService'
import { useState, useEffect } from 'react'
import MessageBox from './MessageBox'

const MessageContainer = ({ messages }) => {
    return (
        <Paper
            sx={{
                width: '100%',
                maxWidth: 600,
                height: '100%',
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
        >
            {messages.map((m, index) => (
                <MessageBox message={m} />
            ))}
        </Paper>
    )
}

export default MessageContainer
