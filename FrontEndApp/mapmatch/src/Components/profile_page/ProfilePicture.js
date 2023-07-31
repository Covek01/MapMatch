import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import PopUp from './PopUp'
import { Button } from '@mui/material'

export default function ProfilePicture({ photo }) {
    return (
        <>
            <div>
                <Avatar
                    alt="Remy Sharp"
                    src={photo}
                    sx={{
                        width: 150,
                        height: 150,
                        '@media (max-width: 900px)': {
                            width: 100,
                            height: 100,
                        },
                    }}
                />
            </div>
        </>
    )
}
