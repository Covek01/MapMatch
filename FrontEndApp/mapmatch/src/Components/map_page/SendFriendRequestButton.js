import { useState } from "react";
import axios from "axios";
import {Button} from "@mui/material";
import { useEffect } from "react";
import UserService from "Services/UserService";
import RequestService from "Services/RequestService";
import FriendshipService from "Services/FriendshipService";
import FriendRequestUtility from "Components/profile_page/objects/FriendRequestUtility";
import RequestUtilityFactory from "Components/profile_page/objects/RequestUtilityFactory";

const SendFriendRequestButton = (user) => {
    const [requestSent, setRequestSent] = useState(false);
    const [userHere, setUser] = useState('');
    const [areWeFriends, setAreWeFriends] = useState(false)
    const [rejectedFriendRequestExists, setRejectedFriendRequestExists] = useState(false)
    
    const friendRequestUtility = RequestUtilityFactory.createRequestUlilityByName("Friend request")

    const isFriendRequestSent = async () =>{
        try {
            const myid = (await UserService.getMyId()).data

            const { data, status } =
                await RequestService.CheckIfFriendRequestExists(myid, user.user.id)
            if (status == 200) {
                console.log('uspeo fetch')
                setRequestSent(data)
            }
        } catch (error) {
           console.error(error)
        }    
    }

    useEffect(() => {
        isFriendRequestSent()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            isFriendRequestSent()
      }, 2000)
    
      return () => clearInterval(interval)
    
      }, [])

    const friendRequestExists = async () =>{
        try {
            const myid = (await UserService.getMyId()).data

            const { data, status } =
                await RequestService.rejectedFriendRequestExists()
            if (status == 200) {
                console.log('uspeo fetch')
                setRejectedFriendRequestExists(data)
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }    
    }

    useEffect(() => {
        friendRequestExists()
    }, [])
    
    useEffect(() => {
        const interval = setInterval(() => {
            friendRequestExists()
      }, 2000)
    
      return () => clearInterval(interval)
    
      }, [])

    useEffect(() =>{
        setUser(user.user)
    }, [])


    const sendFriendRequest = async (userId) => {
        //friendRequestUtility.sendRequestFromMe(userId)

        const myid = (await UserService.getMyId()).data
        try{
            await RequestService.InsertFriendRequestsByIds(myid, userId);
            setRequestSent(true)
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response.status == 404) {
                console.log(error.response.data)
            }
        }
        
    }

    const unsendFriendRequest = async (userId) => {
        friendRequestUtility.unsendRequestFromMe(userId)
        setRequestSent(false)
    }



    return(
        <>
        {(!requestSent) &&
            <Button sx={{fontSize:"12px", backgroundColor: "#314f4d"}} variant="contained"
                        active={rejectedFriendRequestExists}
                        onClick={async (e) => {
                        const myid = (await UserService.getMyId()).data
                        await sendFriendRequest(user.user.id)
                        }}
                    >Send request
            </Button>}       
        {(requestSent) && 
            <Button sx={{fontSize:"12px", backgroundColor: "#8ea490"}} variant="contained"
                        onClick={async (e) => {
                        const myid = (await UserService.getMyId()).data
                        await unsendFriendRequest(user.user.id)
                        }}
                    >Unsend request
            </Button>
        }
        </>
    )
}

export default SendFriendRequestButton;