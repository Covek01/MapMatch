import MessageContainer from './MessageContainer'
import InputMessage from './InputMessage.js'
import React from 'react'

import { Paper, TableContainer } from '@mui/material'

const Chat = ({ messages, sendMessage, groupInfo }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                mt: 2,
                width: '100%',
                maxWidth: 600,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
        >
            <MessageContainer messages={messages} />
            <InputMessage sendMessage={sendMessage} groupInfo={groupInfo} />
        </Paper>
    )
}

export default Chat
