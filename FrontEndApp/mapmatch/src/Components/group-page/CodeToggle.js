import Switch from '@mui/material/Switch'
import React, { useEffect, useState, createTheme } from 'react'
import { redirect, useNavigate, useParams } from 'react-router-dom'
import GroupService from 'Services/GroupService'
import axios from 'axios'

const label = { inputProps: { 'aria-label': 'Switch demo' } }

export default function BasicSwitches({ onCodeEnabled }) {
    const [isChecked, setIsChecked] = useState(false)
    const { groupId, userId } = useParams()

    const fetchGroupCode = async () => {
        console.log('prazan string funckija')
        const { data: groupCode } = await GroupService.getGroupCode(groupId)

        if (groupCode === '') setIsChecked(true)
    }

    useEffect(() => {
        fetchGroupCode()
    }, [])

    const handleToggle = () => {
        setIsChecked(!isChecked)

        if (isChecked) {
            const enable = async () => {
                try {
                    const { status } = await GroupService.EnableGroupCode(
                        groupId
                    )
                    if (status == 200) {
                        console.log('kod je enabled')
                        onCodeEnabled(true)
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.log(error.response.data)
                    }
                }
            }
            enable()
        } else {
            const disable = async () => {
                try {
                    const { status } = await GroupService.DisableGroupCode(
                        groupId
                    )
                    if (status == 200) {
                        console.log('kod je disabled')
                        onCodeEnabled(false)
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.log(error.response.data)
                    }
                }
            }
            disable()
        }
    }
    return (
        <div>
            <Switch
                color="success"
                style={{
                    color: isChecked ? 'white' : '#8ea490',
                    '& .MuiSwitch-track': {
                        backgroundColor: 'white',
                    },
                }}
                checked={isChecked}
                onChange={handleToggle}
                inputProps={{ 'aria-label': 'Disable code' }}
            />
        </div>
    )
}
