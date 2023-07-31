import React, { useState, useRef } from 'react'
import { Button, FormControl, Input } from '@mui/material'
import UserService from 'Services/UserService'
import axios from 'axios'

const InputMessage = ({ sendMessage, groupInfo }) => {
    const [message, setMessage] = useState('')

    const refInput = useRef(null)

    const handleSendMessage = async () => {
        const myid = (await UserService.getMyId()).data
        if (groupInfo.isGroup) {
            sendMessage(message, myid, groupInfo.id, groupInfo.isGroup)
        } else {
            sendMessage(
                message,
                myid,
                groupInfo.otherUserOrGroupName,
                groupInfo.isGroup
            )
        }

        refInput.current.value = ''
        setMessage('') // Reset the state value after sending the message
    }

    return (
        <div style={{ display: 'flex' }}>
            <FormControl
                variant="standard"
                fullWidth
                sx={{ borderRadius: '16px' }}
            >
                <Input
                    sx={{ borderRadius: '16px' }}
                    ref={refInput}
                    color="success"
                    type="text"
                    key="input-message"
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </FormControl>
            <Button
                variant="contained"
                sx={{ backgroundColor: '#8ea490 !important' }}
                onClick={async (e) => {
                    try {
                        await handleSendMessage()
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            console.error(error.message)
                        }
                    }
                }}
            >
                Send
            </Button>
        </div>
    )
}

export default InputMessage
