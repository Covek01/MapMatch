import { Avatar, Button, Box, InputLabel, Paper } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import FriendshipService from 'Services/FriendshipService'
import UserService from 'Services/UserService'
import GroupInfo from './objects/GroupInfo'
import axios from 'axios'

const ChatBox = ({
    group,
    joinRoom,
    connection,
    refreshMessages,
    setGroupInfo,
}) => {
    //group - bool, name - string, idGroup, idUser

    async function returnNameOfRoomByGroupOrPrivateChat(group) {
        if (group.isGroup) {
            return group.id.toString()
        } else {
            const myid = (await UserService.getMyId()).data
            const id2 = (await UserService.getUserIdByUsername(group.name)).data
            const roomName = (
                await FriendshipService.GetFriendshipRoomName(myid, id2)
            ).data
            return roomName //ostavljeno da se izvuce friendship i ko je owner
        }
    }
    const closeConnectionIfExists = async (connection) => {
        try {
            if (connection != null && connection != undefined) {
                connection.stop()
            }
        } catch (e) {
            console.log(e)
        }
    }

    const connectionExists = () => {
        return connection != null || connection != undefined
    }

    return (
        <Paper
            className="message-box"
            sx={{
                backgroundColor: 'white',
                mt: 1,
                background: '#8ea490',
                opacity: '0.8',
            }}
        >
            <div className="flex space-between">
                <Avatar
                    alt="No profile picture"
                    className="inline-block"
                    src={group.imgSource}
                    sx={{ width: 60, height: 60, marginTop: 1 }}
                />
                <InputLabel
                    className="group-name"
                    style={{
                        alignSelf: 'center',
                        maxWidth: '30%',
                        color: 'black',
                    }}
                >
                    {group.name}
                </InputLabel>
            </div>
            <Button
                variant="contained"
                size="small"
                sx={{
                    marginLeft: 2,
                    marginTop: 2,
                    marginBottom: 1,
                    backgroundColor: 'white !important',
                    color: '#314f4d !important',
                }}
                onClick={async (e) => {
                    try {
                        await closeConnectionIfExists(connection)
                        const username = (await UserService.getMyUsername())
                            .data
                        if (group.isGroup) {
                            await refreshMessages(
                                username,
                                group.isGroup,
                                null,
                                group.realId
                            )
                        } else {
                            await refreshMessages(
                                username,
                                group.isGroup,
                                group.name,
                                null
                            )
                        }

                        const roomName =
                            await returnNameOfRoomByGroupOrPrivateChat(group)
                        await setGroupInfo(
                            new GroupInfo(group.isGroup, group.name, group.realId)
                        )
                        await joinRoom(username, roomName)
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            console.error(error.message)
                        }
                    }
                }}
            >
                Chat
            </Button>
        </Paper>
    )
}

export default ChatBox
