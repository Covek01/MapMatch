import * as React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { Button, Stack, Typography } from '@mui/material'
import ProfilePicture from '../profile_page/ProfilePicture'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import GroupPhotoUploaderPopUp from './GroupPhotoUploaderPopUp'
import PrimarySearchAppBar from '../profile_page/ProfilePageHeader'
import UserService from 'Services/UserService'
import axios from 'axios'
import { useEffect } from 'react'
import FriendshipService from 'Services/FriendshipService'
import FriendsPopUp from '../profile_page/FriendsPopUp'
import GroupsPopUp from '../profile_page/GroupsPopUp'
import GroupService from 'Services/GroupService'
import InviteCodeDialog from './InviteCodeDialog'
import GroupMembers from './GroupMembers'
import AdminFriendsList from './AdminFriendsList'
import Divider from '@mui/material/Divider'
import bgImage from '../profile_page/BackgroundNew.jpeg'
import IconButton from '@mui/material/IconButton'
import NotListedLocationOutlinedIcon from '@mui/icons-material/NotListedLocationOutlined'
import CodeToggle from './CodeToggle'

export default function GrooupFinal() {
    const { groupId, userId } = useParams()
    const [isGroupAdmin, setIsGroupAdmin] = useState(false)
    const [isGroupMember, setIsGroupMember] = useState(false)
    const [groupInfo, setGroupInfo] = useState({})
    const [codeEnabled, setCodeEnabled] = useState(true)

    const { id, name, photoPath, admin, code } = groupInfo

    const handleGoBack = () => {
        // setShownUserId(id)
    }
    const fetchGroupData = async () => {
        //console.log("group data fetch");
        const { data: info } = await GroupService.getGroup(groupId)

        const { data: userInGroup } = await GroupService.userInGroup(
            userId,
            groupId
        )
        const { data: groupCode } = await GroupService.getGroupCode(groupId)

        setGroupInfo({
            id: info.id,
            name: info.name,
            photoPath: info.photoPath,
            admin: info.adminId,
            code: groupCode,
        })
        setIsGroupMember(userInGroup)
    }

    useEffect(() => {
        fetchGroupData()
    }, [])

    useEffect(() => {
        setIsGroupAdmin(parseInt(userId) == parseInt(groupInfo.admin))
    }, [groupInfo])

    const handleDelete = () => {
        const deleteGroup = async () => {
            try {
                const { status } = await GroupService.deleteGroup(groupId)
                if (status == 200) {
                    console.log('obrisana je grupa')
                }
            } catch (error) {
                console.log('Group Delete')
                if (axios.isAxiosError(error)) {
                    console.log(error.response.data)
                }
            }
        }
        deleteGroup()
    }

    const handleGetNewCode = () => {
        const generateNewCode = async () => {
            const { data: newCode } = await GroupService.getNewCode(groupId)
            setGroupInfo({
                ...groupInfo,
                code: newCode,
            })
        }
        generateNewCode()
    }

    return (
        <div
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}
        >
            <PrimarySearchAppBar />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '90%',
                    padding: '40px',
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        width: '100%',
                        maxWidth: 600,
                        height: '80%',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    }}
                >
                    <ProfilePicture photo={photoPath} />
                    {isGroupAdmin && (
                        <>
                            <GroupPhotoUploaderPopUp
                                setPhoto={(photoPath) =>
                                    setGroupInfo({ ...groupInfo, photoPath })
                                }
                            />
                        </>
                    )}
                    <>
                        <Divider
                            style={{ padding: '5px' }}
                            orientation="horizontal"
                            flexItem
                        />
                        <Typography variant="h4" sx={{ mt: 2 }}>
                            {groupInfo.name}
                        </Typography>
                    </>
                    {(isGroupAdmin || isGroupMember) && (
                        <>
                            <div style={{ padding: '5px' }}>
                                <Divider
                                    style={{ padding: '5px' }}
                                    orientation="horizontal"
                                    flexItem
                                />
                                <InviteCodeDialog
                                    inviteCode={groupInfo.code}
                                ></InviteCodeDialog>
                            </div>
                        </>
                    )}

                    {isGroupAdmin && (
                        <>
                            <Divider
                                style={{ padding: '5px' }}
                                orientation="horizontal"
                                flexItem
                            />
                            <h5>Enable or disable code</h5>
                            <CodeToggle
                                onCodeEnabled={(isEnabledNewValue) => {
                                    fetchGroupData()
                                    setCodeEnabled(isEnabledNewValue)
                                }}
                            >
                                {' '}
                            </CodeToggle>
                        </>
                    )}

                    {isGroupAdmin && (
                        <>
                            <Divider orientation="horizontal" flexItem />
                            <h5>Invite some of your frineds to this group</h5>
                            <div
                                style={{
                                    padding: '10px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <AdminFriendsList
                                    id={groupInfo.id}
                                    adminId={groupInfo.admin}
                                ></AdminFriendsList>
                            </div>
                        </>
                    )}
                    {(isGroupMember || isGroupAdmin) && (
                        <>
                            <Divider orientation="horizontal" flexItem />
                            <h5>See all members</h5>
                            <div style={{ padding: '10px' }}>
                                <GroupMembers
                                    id={groupInfo.id}
                                    isAdminOfGroup={isGroupAdmin}
                                ></GroupMembers>
                            </div>
                        </>
                    )}

                    {isGroupAdmin && (
                        <>
                            <Divider
                                style={{ padding: '5px' }}
                                orientation="horizontal"
                                flexItem
                            />
                            <h5>
                                You don't need group anymore? Let's say Goodbye!
                            </h5>
                            <div>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: '#8ea490' }}
                                    onClick={handleDelete}
                                >
                                    {' '}
                                    Delete Group
                                </Button>
                            </div>
                        </>
                    )}

                    {isGroupAdmin && (
                        <>
                            <Divider
                                orientation="horizontal"
                                flexItem
                                style={{ padding: '5px' }}
                            />
                            <h5>Want to generate new code? Let's make it!</h5>
                            <div>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: '#8ea490' }}
                                    onClick={handleGetNewCode}
                                >
                                    {' '}
                                    Get New Code
                                </Button>
                            </div>
                        </>
                    )}
                </Paper>
            </Box>
        </div>
    )
}
