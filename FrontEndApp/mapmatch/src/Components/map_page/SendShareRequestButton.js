import { useState } from "react";
import axios from "axios";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect } from "react";
import UserService from "Services/UserService";
import RequestService from "Services/RequestService";
import { useSnackbar } from "Context/SnackbarContext/SnackbarContext";
import React from "react";
import FriendshipService from "Services/FriendshipService";

export default function SendShareRequestButton({ user, senderId }) {

    const [requestSent, setRequestSent] = useState(false);
    const [nonMutualFriends, setNonMutualFriends] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const { openSnackbar } = useSnackbar();
    const [open, setOpen] = React.useState(() => false)
    // useEffect(() => {
    //     const IsShareRequestSent = async () => {
    //         try {
    //             const {data,status}=await RequestService.IsShareRequestSent(senderId,user.id,)

    //         } catch () {

    //         }
    //     }
    // }, [])
    useEffect(() => {
        console.log("HI from here");
        const GetNonMutualFriends = async () => {
            try {
                const { data, status } = await FriendshipService.GetNonMutualFriends(senderId, user.id);
                if (status == 200) {
                    setNonMutualFriends(data);
                    console.log("DATA:", data);
                } else {
                    console.log(status, data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        GetNonMutualFriends();
    }, []);

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = (refered) => {
        return () => {
            //--------- da uzememo id prijatelja
            setOpen(false)
            sendShareRequest(refered);
        }
    }

    // function firstButtonHandle(openCheck){

    //     console.log("CLICK CLICK CLICK");
    //     return(

    //     );
    // }


    const sendShareRequest = async (refered) => {
        try {
            const { data, status } = await RequestService.InsertLocationShareRequestByIds(senderId, user.id, refered);
            if (status == 200) {
                openSnackbar({ message: "Location share request sent", severity: "info" });
            } else if (status == 400) {
                openSnackbar({ message: `${data}`, severity: "info" })
            } else {
                openSnackbar({ message: "Location share request failed to send", severity: "info" });
            }
        } catch (error) {
            console.error(error.message);
            openSnackbar({ message: "Location share request failed to send", severity: "info" });
        }
    }

    return (
        <>
            {nonMutualFriends && <Button onClick={handleClickOpen} variant="contained"
                color="primary"
            >Share Location</Button>}


            <>
                <Dialog
                    //fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                //  aria-labelledby="responsive-dialog-title"
                >
                    <div className="popUpFriends">
                        <DialogTitle id="responsive-dialog-title">
                            Friends
                        </DialogTitle>
                        <DialogContent>
                            <ul role="list" className="divide-y divide-gray-100">
                                {nonMutualFriends && nonMutualFriends.map((person) => {
                                    return (<li
                                        onClick={handleSubmit(
                                            person.id
                                        )}
                                        key={person.username}
                                        className="flex justify-between gap-x-6 py-5  rounded   hover:bg-gradient-to-b from-gray-300 to-transparent"
                                    >
                                        <div className="flex gap-x-4  ">
                                            <img
                                                className="h-12 w-12 flex-none rounded-full bg-gray-150"
                                                src={person.profilePhoto}
                                                alt=""
                                            />
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                                    {person.username}
                                                </p>
                                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                                    {person.email}
                                                </p>
                                            </div>
                                        </div>

                                    </li>
                                    )
                                })}
                            </ul>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                autoFocus
                                style={{ color: 'black', borderColor: 'black' }}
                                onClick={handleClose}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </div>
                </Dialog>
            </>
        </>
    );
}