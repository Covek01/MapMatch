import React, { useEffect } from 'react'
import ProfileContent from './FriendProfileContent'
import bgImage from './pozadina.jpg'
import PrimarySearchAppBar from './ProfilePageHeader'
import Footer from './FooterProfile'
import { useState } from 'react'
export default function FinalProfile({ connectionOnline }) {
    useEffect(() => {
        console.log(connectionOnline)
    }, [])

    const [openSnackbar, setOpenSnackbar] = useState(false)

    return (
        <div className="background-profile">
            <ProfileContent />
        </div>
    )
}
