import Chat from './Chat.js'
import MessageContainer from './MessageContainer'
import EmptyChatSkeleton from './EmptyChatSkeleton.js'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useState, useEffect } from 'react'
import React from 'react'
import { sendMessage } from '@microsoft/signalr/dist/esm/Utils'
import GroupList from './GroupList.js'
import FriendshipService from 'Services/FriendshipService.js'
import MessageService from 'Services/MessageService.js'
import UserService from 'Services/UserService.js'
import GroupInfo from './objects/GroupInfo.js'
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ChatNavBar from './ChatNav.js'
import bgImage from '../profile_page/BackgroundNew.jpeg'

const Group = ({ connectionOnline }) => {
    const [connection, setConnection] = useState(null)
    const [messages, setMessages] = useState([])
    const [groups, setGroups] = useState([])

    const [user, setUser] = useState()
    const [groupInfo, setGroupInfo] = useState(new GroupInfo(false, null, -1))
    const [room, setRoom] = useState()

    const setChatListForUser = async () => {
        const id = (await UserService.getMyId()).data
        const chats = (await MessageService.GetAllChatsForUser(id)).data
        const chatsNew =  chats.map((group) => {
            return {
                isGroup: group.tip === 'group' ? true : false,
                name: group.name,
                imgSource: group.photo,
                id: group.id,
                realId: group.groupUserId
            }
        })
        setGroups(
           chatsNew
        )
        console.log(chatsNew)
    }

    const [prob, setProb] = useState([])
    useEffect(() => {
        setChatListForUser()
        console.log(groups)
        console.log(connectionOnline)
    }, [prob])

    const refreshMessages = async (thisUser, isGroup, user2, idGroup) => {
        const idThisUser = (await UserService.getUserIdByUsername(thisUser))
            .data
        if (isGroup) {
            const mess = (await MessageService.GetAllGroupMessages(idGroup))
                .data
            const messagesShow = mess.map((m) => {
                return { message: m.message, user: m.senderUsername }
            })
            setMessages(messagesShow)
        } else {
            const idUser1 = (await UserService.getUserIdByUsername(thisUser))
                .data
            const idUser2 = (await UserService.getUserIdByUsername(user2)).data
            //const mess = (await MessageService.GetAllDirectMessages(idUser1, idUser2)).data;
            const shiftLeft = 0
            const number = 5
            const mess = (
                await MessageService.GetAllDirectMessagesFromToWithShift(
                    idUser1,
                    idUser2,
                    shiftLeft,
                    number
                )
            ).data
            const messagesShow = mess.map((m) => {
                return { message: m.text, user: m.senderName }
            })
            setMessages(messagesShow)
        }
    }

    const sendMessage = async (message, idSender, userOrGroupName, isGroup) => {
        //userOrGroupName je ili ime usera, ili id grupe
        await connection.invoke('SendMessage', message)
        if (isGroup) {
            const idGroupString = userOrGroupName
            await MessageService.AddGroupMessage(
                idSender,
                idGroupString,
                message
            )
        } else {
            const idReceiver = (
                await UserService.getUserIdByUsername(userOrGroupName)
            ).data
            await MessageService.AddDirectMessage(idSender, idReceiver, message)
        }
    }

    const joinRoom = async (user, roomName) => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl('https://localhost:7229/chat')
                .configureLogging(LogLevel.Information)
                .build()

            connection.on('ReceiveMessage', (user, message) => {
                console.log('message received: ', message)
                setMessages((messages) => [...messages, { user, message }])
            })

            await connection.start()
            await connection.invoke('JoinRoom', user, roomName)
            setConnection(connection)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                minHeight: '100vh',
            }}
        >
            <Box
                sx={{
                    flexGrow: 1,
                }}
            >
                <AppBar
                    position="static"
                    sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                >
                    <ChatNavBar></ChatNavBar>
                </AppBar>
                <div className="flex content-center">
                    <GroupList
                        groups={groups}
                        joinRoom={joinRoom}
                        refreshMessages={refreshMessages}
                        connection={connection}
                        setGroupInfo={setGroupInfo}
                    />

                    {connection ? (
                        <Chat
                            messages={messages}
                            sendMessage={sendMessage}
                            groupInfo={groupInfo}
                        />
                    ) : (
                        <EmptyChatSkeleton />
                    )}
                </div>
                <AppBar
                    position="static"
                    sx={{ backgroundColor: '#8ea490' }}
                ></AppBar>
            </Box>
        </div>
    )
}

export default Group
