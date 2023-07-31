import ChatBox from './ChatBox.js'
import { Box, Paper } from '@mui/material'
import React from 'react'

const GroupList = ({
    groups,
    joinRoom,
    connection,
    refreshMessages,
    setGroupInfo,
}) => {
    return (
        <Paper
            sx={{
                width: '35%',
                mt: 1,
            }}
            className="chat-list-style"
        >
            {groups.map((group, index) => (
                <ChatBox
                    group={group}
                    joinRoom={joinRoom}
                    connection={connection}
                    key={index}
                    refreshMessages={refreshMessages}
                    setGroupInfo={setGroupInfo}
                />
            ))}
        </Paper>
    )
}

export default GroupList
