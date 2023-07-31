import './Components/home_page/App.css'
import Button from '@mui/material/Button'
import IndexNaBar from './Components/home_page/IndexNaBar'
import NavBar from './Components/home_page/IndexNaBar'
import MapPage from 'Components/map_page/MapPage'
import React, { useState } from 'react'
import Profile from 'Components/profile_page/MyProfilePage'
import ProfilePage from 'Components/profile_page/MyProfilePage'
import PhotoUploadComponent from 'Components/profile_page/PhotoUploader'
import RequestsPopUp from 'Components/profile_page/RequestsList'
import RRequestsPopUp from 'Components/profile_page/RequestsPopUp'
import PopUp from 'Components/profile_page/PopUp'
import RequestsList from 'Components/profile_page/RequestsList'
import FriendsList from 'Components/profile_page/FriendsList'
import IndexHeader from 'Components/home_page/IndexHeader'
import MapMainContent from 'Components/map_page/MapMainContent'
import { Register } from 'Components/Sign-in/Register'
import { Login } from 'Components/Sign-in/Login'
import { GoogleLogin } from '@react-oauth/google'
import PrivateRoutes from 'utils/PrivateRoutes'
import FriendsForLife from 'Components/profile_page/DropDownFriends'

import './index.css'
import './SignIn.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import OAuth from 'Components/Sign-in/OAuth'
import LisOfFriends from 'Components/profile_page/ListOfFriends'
import './tailwind.css'
import NavBarTailWind from 'Components/home_page/navBarTailWind'
import ChatComponent from 'Components/chat/wholeChat'
import FriendProfilePage from 'Components/profile_page/FriendProfilePage'
import NonFriendProfilePage from 'Components/profile_page/NonFriendProfilePage'
import MyProfilePage from 'Components/profile_page/MyProfilePage'
import InputMessage from 'Components/chat/InputMessage'
import Group from 'Components/chat/Group'
import ProfileContent from 'Components/profile_page/FriendProfileContent'
import FinalProfile from 'Components/profile_page/FinalProfile'
import AdminGroupContent from 'Components/group-page/AdminGroupPage'
import InviteDialogForAdmin from 'Components/group-page/InviteDialogForAdmin'
import GrooupFinal from 'Components/group-page/GrooupFinal'
import OnlineConnectionUtility from 'Components/snackbar-notification/objects/OnlineConnectionUtility'

function App() {
    const [connectionOnline, setConnection] = useState(
        OnlineConnectionUtility.connection
    )

    return (
        <Router>
            <div>
                <div className="content">
                    <Routes>
                        <Route element={<PrivateRoutes />}>
                            <Route
                                path="/profile/:username"
                                element={
                                    <FinalProfile
                                        connectionOnline={connectionOnline}
                                    />
                                }
                            />
                            <Route
                                path="/group/:groupId/:userId"
                                element={<GrooupFinal />}
                            />
                            <Route path="/map" element={<MapPage />} />
                           
                            <Route
                                path="/admin"
                                element={<AdminGroupContent />}
                            />
                            <Route
                                path="/message"
                                element={
                                    <Group
                                        connectionOnline={connectionOnline}
                                    />
                                }
                            />
                            <Route path="/navbar" element={<MyProfilePage />} />
                        </Route>
                        <Route path="/" element={<IndexHeader />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export default App
